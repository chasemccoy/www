import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'
import { DateTime } from 'https://unpkg.com/luxon@3.2.0/build/es6/luxon.js'
import slugify from 'https://unpkg.com/@sindresorhus/slugify@2.1.1?module'

// Assumptions:
// - Will only show posts that have a title & date
const App = {}

const filesToFilter = [
  'Default constraint behaviors using Swift protocols',
  'Gatsby schema customization is pretty cool',
]

const countWords = (string) => {
  string = string.replace(/(^\s*)|(\s*$)/gi, '')
  string = string.replace(/[ ]{2,}/gi, ' ')
  string = string.replace(/\n /, '\n')
  return string.split(' ').filter(String).length
}

const debounce = (callback, wait) => {
  let timeout
  return (...args) => {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => callback.apply(context, args), wait)
  }
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

const getDataForFile = async (fileHandle) => {
  const file = await fileHandle.getFile()
  const contents = await file.text()
  const titleRegex = /title: (.*)/
  const hiddenRegex = /hidden: true/
  const dateRegex = /date: (.*)/
  const matchTitle = contents.match(titleRegex)
  const matchDate = contents.match(dateRegex)
  const draft = hiddenRegex.test(contents)
  if (matchTitle && matchDate) {
    const title = matchTitle[1]
    const date = DateTime.fromISO(matchDate[1])
    const frontmatterRegex = /^---\n(.*\n)+---\n/
    const wordCount = countWords(contents.replace(frontmatterRegex, '').trim())

    return {
      title,
      date,
      contents,
      draft,
      wordCount,
    }
  }

  return {
    contents,
    draft,
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
    suggestedName: name + '.md',
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

const initApp = () => {
  App.pickerButton = document.getElementById('pick-directory')
  App.fileList = document.getElementById('file-list')
  App.draftsList = document.getElementById('drafts-list')
  App.saveButton = document.getElementById('save')
  App.viewPostButton = document.getElementById('view-post')
  App.createDialog = document.getElementById('create-dialog')
  App.createButton = document.getElementById('create-button')
  App.openInCodeButton = document.getElementById('open-vscode')

  App.editor = ace.edit('editor')
  App.editor.setTheme('ace/theme/github')
  App.editor.session.setMode('ace/mode/markdown')

  // All options are listed here:
  // https://github.com/ajaxorg/ace/wiki/Configuring-Ace
  App.editor.setOptions({
    fontFamily: 'JetBrains Mono',
    fontSize: '0.85rem',
    behavioursEnabled: true,
    enableAutoIndent: true,
    showLineNumbers: true,
    showPrintMargin: false,
    showFoldWidgets: false,
    showGutter: true,
    indentedSoftWrap: false,
    useWorker: false,
    wrap: 68,
    tabSize: 2,
    keyboardHandler: 'ace/keyboard/vscode',
  })

  App.editor.session.on('change', async () => {
    if (App.currentFile && App.editor.getValue() !== App.currentFile.contents) {
      App.saveButton.hidden = false
      App.editorState = 'dirty'
    } else {
      App.saveButton.hidden = true
      App.editorState = ''
    }
  })

  App.editor.session.on(
    'change',
    debounce(async () => {
      if (
        App.currentFile &&
        App.editor.getValue() !== App.currentFile.contents
      ) {
        await writeFile(App.currentFile, App.editor.getValue())
        App.editorState = ''
        App.saveButton.hidden = true
      }
    }, 300)
  )

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
        const data = await getDataForFile(entry)
        Object.assign(entry, data)
        entry.slug = entry.name.replace('.md', '')
        if (data.title && !filesToFilter.includes(data.title)) {
          App.files.push(entry)
        }
      } else if (entry.kind === 'directory') {
        const fileEntry = await entry.getFileHandle('index.md')
        const data = await getDataForFile(fileEntry)
        Object.assign(fileEntry, data)
        fileEntry.slug = entry.name
        if (data.title && !filesToFilter.includes(data.title)) {
          App.files.push(fileEntry)
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
            `date: ${DateTime.now().toISODate()}`,
            'hidden: true',
            '---',
            '',
            note,
          ].join('\n')

          const file = await createNewFile(slug, contents)
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

    document.querySelector('textarea.ace_text-input')?.addEventListener(
      'paste',
      (event) => {
        event.preventDefault()
        event.stopPropagation()

        const clipboardText = (
          event.clipboardData || window.clipboardData
        ).getData('text')
        const currentSelection = App.editor.getSelectedText()

        if (clipboardText.includes('http') && currentSelection !== '') {
          const link = `[${currentSelection}](${clipboardText.trim()})`
          App.editor.insert(link)
        } else {
          App.editor.insert(clipboardText)
        }
      },
      true
    )

    App.files = App.files.sort((a, b) => b.date.toMillis() - a.date.toMillis())

    await populateFiles()
    App.draftsList.querySelector('li:first-child button')?.click()
  }

  App.pickerButton.click()
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
      App.editor.session.setValue(file.contents)
      App.editorState = ''
      App.saveButton.hidden = true
      App.currentFile = file
      clearActiveNavItems()
      button.dataset.active = true
      App.viewPostButton.hidden = false
      App.openInCodeButton.hidden = false
      App.viewPostButton.href = `http://localhost:1995${file.date.toFormat(
        '/yyyy/MM/'
      )}${file.slug}`
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

    button.innerText = file.title
    li.appendChild(button)
    if (file.draft) {
      li.dataset.age = diffInDays
      const span = document.createElement('span')
      span.innerText = `${diffInDays}d, ${file.wordCount}w`
      button.appendChild(span)
      App.draftsList.appendChild(li)
    } else {
      App.fileList.appendChild(li)
    }
  }

  const drafts = Array.from(App.draftsList.querySelectorAll('li[data-age]'))
  const sortedDrafts = drafts.sort(
    (a, b) => parseInt(b.dataset.age) - parseInt(a.dataset.age)
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