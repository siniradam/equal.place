export const dateString = (d) => {
	let date = new Date(d * 1000).toDateString().split(' ');
	date.shift();
	return date.join(' ');
};
