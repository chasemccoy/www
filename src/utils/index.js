export const getColorForSection = (section) => {
	switch (section) {
		case 'blog':
			return 'var(--color-red)';
		case 'notes':
			return 'var(--color-purple)';
		case 'books':
			return 'var(--color-blue)';
		case 'quotes':
			return 'var(--color-yellow)';
		default:
			return 'var(--color-green)';
	}
};

export const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const formatDate = (date) => {
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',	'November', 'December'];

	const month = months[date.getMonth()]
	const day = date.getDate()
	const year = date.getFullYear()

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