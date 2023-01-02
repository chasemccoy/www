import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'
import { DateTime } from 'https://unpkg.com/luxon@3.2.0/build/es6/luxon.js'

// Assumptions:
// - Will only show posts that have a title & date
const App = {}

const filesToFilter = [
  'Default constraint behaviors using Swift protocols',
  'Gatsby schema customization is pretty cool',
]

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

    return {
      title,
      date,
      contents,
      draft,
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
  await writable.close()
}

const initApp = () => {
  App.pickerButton = document.getElementById('pick-directory')
  App.fileList = document.getElementById('file-list')
  App.draftsList = document.getElementById('drafts-list')
  // App.editor = document.getElementById('editor')
  App.saveButton = document.getElementById('save')
  App.createDialog = document.getElementById('create-dialog')
  App.createButton = document.getElementById('create-button')

  App.editor = ace.edit('editor')
  App.editor.setTheme('ace/theme/github')
  App.editor.session.setMode('ace/mode/markdown')

  // All options are listed here:
  // https://github.com/ajaxorg/ace/wiki/Configuring-Ace
  App.editor.setOptions({
    fontFamily: 'JetBrains Mono',
    fontSize: '0.9rem',
    behavioursEnabled: true,
    enableAutoIndent: true,
    showLineNumbers: true,
    showPrintMargin: false,
    showFoldWidgets: false,
    showGutter: true,
    indentedSoftWrap: false,
    useWorker: false,
    wrap: 64,
    tabSize: 2,
    keyboardHandler: 'ace/keyboard/vscode',
  })

  App.editor.session.on('change', async (delta) => {
    if (App.currentFile && App.editor.getValue() !== App.currentFile.contents) {
      App.saveButton.hidden = false
      App.editorState = 'dirty'
    } else {
      App.saveButton.hidden = true
      App.editorState = ''
    }
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
        const data = await getDataForFile(entry)
        Object.assign(entry, data)
        if (data.title && !filesToFilter.includes(data.title)) {
          App.files.push(entry)
        }
      } else if (entry.kind === 'directory') {
        const fileEntry = await entry.getFileHandle('index.md')
        const data = await getDataForFile(fileEntry)
        Object.assign(fileEntry, data)
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

    App.createDialog.onclose = ({ target: dialog }) => {
      if (dialog.returnValue === 'confirm') {
        const formData = new FormData(dialog.querySelector('form'))
        console.info('Dialog form data', Object.fromEntries(formData.entries()))

        if (formData.title) {
          // slugify title
          // generate frontmatter with date
          // create file
        }

        dialog.querySelector('form')?.reset()
      }
    }

    // App.createDialog.addEventListener('click', (event) => {
    //   const rect = App.createDialog.getBoundingClientRect()
    //   if (
    //     event.clientY < rect.top ||
    //     event.clientY > rect.bottom ||
    //     event.clientX < rect.left ||
    //     event.clientX > rect.right
    //   ) {
    //     App.createDialog.close()
    //   }
    // })

    App.files = App.files.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    )

    populateFiles()
  }
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

    button.onclick = () => {
      if (App.editorState === 'dirty') {
        if (confirm('You have unsaved changes.')) {
          App.editor.session.setValue(file.contents)
          App.editorState = ''
          App.saveButton.hidden = true
          App.currentFile = file
          clearActiveNavItems()
          button.dataset.active = true
        }
      } else {
        App.editor.session.setValue(file.contents)
        App.editorState = ''
        App.saveButton.hidden = true
        App.currentFile = file
        clearActiveNavItems()
        button.dataset.active = true
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
      span.innerText = `${diffInDays}d`
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
})

window.onbeforeunload = function (e) {
  e.preventDefault()

  if (App.editorState === 'dirty') {
    return 'You have unsaved changes. Are you sure you want to close this tab?'
  }
}
