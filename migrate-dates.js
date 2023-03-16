const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '/posts')

fs.readdirSync(dir).forEach((item) => {
  let file = path.join(dir, item)

  if (fs.lstatSync(file).isDirectory()) {
    file = path.join(file, 'index.md')
  }

  const contents = fs.readFileSync(file).toString()
  const date = /date: (.*)/g.exec(contents)
  if (date) {
    fs.renameSync(path.join(dir, item), path.join(dir, `${date[1]}-${item}`))
  } else {
    console.log('No `date:` found for file: ', file)
  }
})
