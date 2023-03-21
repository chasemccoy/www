const fs = require('fs')
const path = require('path')

const LOG_FILE = '../log.md'

const getEntries = () => {
  const file = fs.readFileSync(path.resolve(__dirname, LOG_FILE))
  const fileString = file.toString()
  let entries = fileString.split('---').map((item) => item.trim())

  entries = entries.map((entry) => {
    if (entry.startsWith('# ')) {
      // remove the first line of metadata
      return entry.split('\n').slice(1).join('\n').trim()
    }

    return entry
  })

  console.log(entries)
  return entries
}

module.exports = {
  getEntries,
}

// // Define the regular expression
// const regex = /^# (\d{4}-\d{2}-\d{2}) (.*)$/;

// // Define the string to search
// const text = "# 2022-12-01 Some text";

// // Search for the pattern in the string
// const match = regex.exec(text);

// // Print the date and title
// if (match) {
//   const date = match[1];
//   const title = match[2];
//   console.log(`Date: ${date}`);
//   console.log(`Title: ${title}`);
// }
