export const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',	'November', 'December'];
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',	'Nov', 'Dec'];

const formatMonth = (date, short = false) => {
	if (short) {
		return shortMonths[date.getMonth()];
	}
	return months[date.getMonth()];
}

export const getDateComponents = (date, options = {}) => {
	const {monthFormat = 'long'} = options;
	const correctedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000)

	return {
		month: formatMonth(correctedDate, monthFormat !== 'long'),
		day: correctedDate.getDate(),
		year: correctedDate.getFullYear()
	}
}

export const formatDate = (date) => {
	const {month, day, year} = getDateComponents(date);
	return `${month} ${day}, ${year}`
}

export const slugify = string => {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}