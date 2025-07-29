const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const shortMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const formatMonth = (date, short = false) => {
  if (short) {
    return shortMonths[date.getMonth()]
  }
  return months[date.getMonth()]
}

const getDateComponents = (date, options = {}) => {
  const { monthFormat = 'long' } = options
  const correctedDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60000
  )

  return {
    month: formatMonth(correctedDate, monthFormat !== 'long'),
    day: correctedDate.getDate(),
    year: correctedDate.getFullYear(),
  }
}

function groupBy(arr, cb) {
  if (!Array.isArray(arr)) {
    throw new Error('expected an array for first argument')
  }

  if (typeof cb !== 'function') {
    throw new Error('expected a function for second argument')
  }

  var result = {}
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i]
    var bucketCategory = cb(item)
    var bucket = result[bucketCategory]

    if (!Array.isArray(bucket)) {
      result[bucketCategory] = [item]
    } else {
      result[bucketCategory].push(item)
    }
  }

  return result
}

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export {
  groupBy,
  getDateComponents,
  capitalize,
}
