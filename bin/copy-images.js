const fs = require('fs-extra');
const path = require('path');

const source = path.join(__dirname, '../posts');
const destination = path.join(__dirname, '../public/img');
const regex = /\.(gif|jpe?g|png|webp|svg)$/i;

const filter = async (src) => {
	const stats = await fs.lstat(src);
	if (stats.isDirectory()) {
		return true;
	}

	return regex.test(src);
};

async function copyImages() {
	try {
		await fs.copy(source, destination, {filter});
	} catch (error) {
		console.error(error);
	}
}

copyImages();
