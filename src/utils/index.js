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
