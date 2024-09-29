import { DateTime } from 'luxon'
import { get, set } from 'idb-keyval'
import slugify from 'slugify'
import { EditorView, keymap } from '@codemirror/view'
import {
  EditorState,
  Text,
  EditorSelection,
  Transaction,
} from '@codemirror/state'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { syntaxTheme } from './syntax-highlighting'
import { syntaxHighlighting } from '@codemirror/language'
import { history, indentWithTab, historyKeymap } from '@codemirror/commands'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'

const App = {}

const countWords = (string) => {
  string = string.replace(/(^\s*)|(\s*$)/gi, '')
  string = string.replace(/[ ]{2,}/gi, ' ')
  string = string.replace(/\n /, '\n')
  return string.split(' ').filter(String).length
}

const getDirectory = async () => {
  try {
    const directoryHandleOrUndefined = await get('directory')

    if (directoryHandleOrUndefined) {
      App.directory = directoryHandleOrUndefined
      return App.directory
    }

    const directoryHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
    })
    await set('directory', directoryHandle)
    App.directory = directoryHandle
    return App.directory
  } catch (error) {
    alert(error.name, error.message)
  }
}

const verifyPermission = async (handle) => {
  const options = { mode: 'readwrite' }

  // Check if permission was already granted. If so, return true.
  if ((await handle.queryPermission(options)) === 'granted') {
    return true
  }
  // Request permission. If the user grants permission, return true.
  if ((await handle.requestPermission(options)) === 'granted') {
    return true
  }
  // The user didn't grant permission, so return false.
  return false
}

const getDataForFile = async (fileHandle, slug) => {
  const file = await fileHandle.getFile()
  const contents = await file.text()
  const titleRegex = /title: (.*)/
  const hiddenRegex = /hidden: true/
  const matchTitle = contents.match(titleRegex)
  const draft = hiddenRegex.test(contents)

  let title = slug
  if (matchTitle) {
    title = matchTitle[1]
  }

  const date = DateTime.fromISO(slug.substring(0, 10))
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/
  const wordCount = countWords(contents.replace(frontmatterRegex, '').trim())

  return {
    title,
    date,
    contents,
    draft,
    wordCount,
    slug,
  }
}

const writeFile = async (fileHandle, contents) => {
  const writable = await fileHandle.createWritable()
  await writable.write(contents)
  fileHandle.contents = contents
  await writable.close()
}

const createNewFile = async (name, contents) => {
  const options = {
    suggestedName: `${DateTime.now().toISODate()}-${name}.md`,
    types: [
      {
        description: 'Markdown files',
        accept: {
          'text/markdown': ['.md'],
        },
      },
    ],
  }
  const handle = await window.showSaveFilePicker(options)
  await writeFile(handle, contents)
  return handle
}

const insertBoldMarker = ({ state, dispatch }) => {
  const changes = state.changeByRange((range) => {
    const isBoldBefore = state.sliceDoc(range.from - 2, range.from) === '**'
    const isBoldAfter = state.sliceDoc(range.to, range.to + 2) === '**'
    const changes = []

    changes.push(
      isBoldBefore
        ? {
            from: range.from - 2,
            to: range.from,
            insert: Text.of(['']),
          }
        : {
            from: range.from,
            insert: Text.of(['**']),
          }
    )

    changes.push(
      isBoldAfter
        ? {
            from: range.to,
            to: range.to + 2,
            insert: Text.of(['']),
          }
        : {
            from: range.to,
            insert: Text.of(['**']),
          }
    )

    const extendBefore = isBoldBefore ? -2 : 2
    const extendAfter = isBoldAfter ? -2 : 2

    return {
      changes,
      range: EditorSelection.range(
        range.from + extendBefore,
        range.to + extendAfter
      ),
    }
  })

  dispatch(
    state.update(changes, {
      scrollIntoView: true,
      annotations: Transaction.userEvent.of('input'),
    })
  )

  return true
}

const insertItalicMarker = ({ state, dispatch }) => {
  const changes = state.changeByRange((range) => {
    const isBoldBefore = state.sliceDoc(range.from - 1, range.from) === '_'
    const isBoldAfter = state.sliceDoc(range.to, range.to + 1) === '_'
    const changes = []

    changes.push(
      isBoldBefore
        ? {
            from: range.from - 1,
            to: range.from,
            insert: Text.of(['']),
          }
        : {
            from: range.from,
            insert: Text.of(['_']),
          }
    )

    changes.push(
      isBoldAfter
        ? {
            from: range.to,
            to: range.to + 1,
            insert: Text.of(['']),
          }
        : {
            from: range.to,
            insert: Text.of(['_']),
          }
    )

    const extendBefore = isBoldBefore ? -1 : 1
    const extendAfter = isBoldAfter ? -1 : 1

    return {
      changes,
      range: EditorSelection.range(
        range.from + extendBefore,
        range.to + extendAfter
      ),
    }
  })

  dispatch(
    state.update(changes, {
      scrollIntoView: true,
      annotations: Transaction.userEvent.of('input'),
    })
  )

  return true
}

const initApp = () => {
  App.pickerButton = document.getElementById('pick-directory')
  App.fileList = document.getElementById('file-list')
  App.draftsList = document.getElementById('drafts-list')
  App.saveButton = document.getElementById('save')
  App.viewPostButton = document.getElementById('view-post')
  App.createDialog = document.getElementById('create-dialog')
  App.createButton = document.getElementById('create-button')
  App.openInCodeButton = document.getElementById('open-vscode')

  let timer

  const state = EditorState.create({
    extensions: [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      history(),
      syntaxHighlighting(syntaxTheme),
      keymap.of([
        indentWithTab,
        ...historyKeymap,
        ...closeBracketsKeymap,
        { key: 'Mod-b', run: insertBoldMarker },
        { key: 'Mod-i', run: insertItalicMarker },
      ]),
      closeBrackets(),
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({
        spellcheck: 'true',
        autocorrect: 'on',
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          if (timer) clearTimeout(timer)
          timer = setTimeout(async () => {
            const contents = update.state.doc.toString()

            if (App.currentFile && contents !== App.currentFile.contents) {
              App.saveButton.hidden = false
              App.editorState = 'dirty'
              await writeFile(App.currentFile, contents)
              App.editorState = ''
              App.saveButton.hidden = true
            } else {
              App.saveButton.hidden = true
              App.editorState = ''
            }
          }, 500)
        }
      }),
      EditorView.domEventHandlers({
        paste: (event) => {
          event.preventDefault()
          event.stopPropagation()

          const clipboardText = (
            event.clipboardData || window.clipboardData
          ).getData('text')
          const currentSelection = App.editor.state.sliceDoc(
            App.editor.state.selection.main.from,
            App.editor.state.selection.main.to
          )

          if (clipboardText.includes('http') && currentSelection !== '') {
            const link = `[${currentSelection}](${clipboardText.trim()})`
            App.editor.dispatch(App.editor.state.replaceSelection(link))
          } else {
            App.editor.dispatch(
              App.editor.state.replaceSelection(clipboardText)
            )
          }
        },
      }),
    ],
  })

  App.editor = new EditorView({
    state,
    parent: document.getElementById('editor'),
  })

  App.pickerButton.onclick = async () => {
    await getDirectory()
    const success = await verifyPermission(App.directory)
    if (success) {
      App.pickerButton.hidden = true
      App.createButton.hidden = false
    }
    App.files = []

    for await (const entry of App.directory.values()) {
      if (entry.kind === 'file' && entry.name.endsWith('.md')) {
        try {
          const slug = entry.name.replace('.md', '')
          const data = await getDataForFile(entry, slug)
          Object.assign(entry, data)
          App.files.push(entry)
        } catch (error) {
          console.error(error)
        }
      } else if (entry.kind === 'directory') {
        try {
          const slug = entry.name
          const fileEntry = await entry.getFileHandle('index.md')
          const data = await getDataForFile(fileEntry, slug)
          Object.assign(fileEntry, data)
          App.files.push(fileEntry)
        } catch (error) {
          console.error(error)
        }
      }
    }

    App.saveButton.onclick = async () => {
      if (App.currentFile) {
        await writeFile(App.currentFile, App.editor.getValue())
        App.editorState = ''
        App.saveButton.hidden = true
      }
    }

    App.createButton.onclick = () => {
      App.createDialog.showModal()
    }

    App.createDialog.onclose = async ({ target: dialog }) => {
      if (dialog.returnValue === 'confirm') {
        const formData = new FormData(dialog.querySelector('form'))
        const { title, note } = Object.fromEntries(formData.entries())

        if (title && title !== '') {
          const slug = slugify(title)
          const contents = [
            '---',
            `title: ${title}`,
            'hidden: true',
            '---',
            '',
            note,
          ].join('\n')

          const file = await createNewFile(slug, contents)
          // TODO gotta pass the slug here *with the date*
          const data = await getDataForFile(file)
          Object.assign(file, data)
          file.slug = file.name.replace('.md', '')
          App.files.push(file)
          await populateFiles()
          // if (App.editorState !== 'dirty') {
          //   /* Select the newly created file in the sidebar */
          // }
        }

        dialog.querySelector('form')?.reset()
      }
    }

    App.files = App.files.sort((a, b) => b.date.toMillis() - a.date.toMillis())

    await populateFiles()
    App.draftsList.querySelector('li:first-child button')?.click()
  }

  // App.pickerButton.click()
}

const clearActiveNavItems = () => {
  const activeItems = document.querySelectorAll('ul button[data-active]')
  activeItems.forEach((item) => {
    delete item.dataset.active
  })
}

const populateFiles = async () => {
  App.fileList.innerHTML = ''
  App.draftsList.innerHTML = ''

  for (const file of App.files) {
    const li = document.createElement('li')
    const button = document.createElement('button')

    const onClick = () => {
      App.editorState = ''
      App.editor.dispatch({
        changes: {
          from: 0,
          to: App.editor.state.doc.length,
          insert: file.contents,
        },
      })
      App.saveButton.hidden = true
      App.currentFile = file
      clearActiveNavItems()
      button.dataset.active = true
      App.viewPostButton.hidden = false
      App.openInCodeButton.hidden = false
      App.viewPostButton.href = `http://localhost:1995${file.date.toFormat(
        '/yyyy/MM/'
      )}${file.slug.slice(11)}`
      const fileName = file.name.includes('index.md')
        ? `${file.slug}/index.md`
        : file.name
      App.openInCodeButton.href = `vscode://file//Users/chase/Repositories/www/posts/${fileName}`
    }

    button.onclick = () => {
      if (App.editorState === 'dirty') {
        if (confirm('You have unsaved changes.')) {
          onClick()
        }
      } else {
        onClick()
      }
    }

    const diffInDays = Math.round(
      DateTime.now().diff(file.date, 'days').toObject().days
    )

    const title = document.createElement('span')
    title.innerText = file.title
    button.appendChild(title)
    li.appendChild(button)
    if (file.draft) {
      li.dataset.age = diffInDays
      const span = document.createElement('span')
      span.innerText = `${diffInDays}d`
      button.appendChild(span)
      App.draftsList.appendChild(li)
    } else {
      App.fileList.appendChild(li)
    }
  }

  const drafts = Array.from(App.draftsList.querySelectorAll('li[data-age]'))
  const sortedDrafts = drafts.sort(
    (a, b) => parseInt(a.dataset.age) - parseInt(b.dataset.age)
  )
  App.draftsList.append(...sortedDrafts)
}

document.addEventListener('DOMContentLoaded', () => {
  initApp()
  document.title = 'Faulkner'
})

window.onbeforeunload = function (e) {
  e.preventDefault()

  if (App.editorState === 'dirty') {
    return 'You have unsaved changes. Are you sure you want to close this tab?'
  }
}
