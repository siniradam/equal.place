import { json } from '@sveltejs/kit';

export const dateString = (d) => {
	let date = new Date(d * 1000).toDateString().split(' ');
	date.shift();
	return date.join(' ');
};

export function isEmpty(value) {
	return (
		value == null ||
		value.size === 0 ||
		value !== value ||
		(value.length === 0 && typeof value !== 'function') ||
		(value.constructor === Object && Object.keys(value).length === 0)
	);
}

export const keyToSomething = (key) => {
	const sumOfNumbers = key
		.replace(/[^0-9]/g, '')
		.split('')
		.reduce((a, b) => parseInt(a) + parseInt(b));
};

export const checkForImage = (url) => {
	let regex = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gim;
	let result;
	if (url.match(regex)) {
		result = {
			match: url.match(regex)
		};
	} else {
		result = false;
	}
	return result;
};

export const contentFilter = (data) => {
	let filter = [
		'bdsmlr.com/',
		'coedcherry.com/',
		'.tnaflix.com/',
		'eporner.com/',
		'i.imgur.com/',
		'xhcdn.com/'
	];
	return !filter.find((word) => {
		return data.content.includes(word);
	});
};

export function parseJSON(data) {
	if (typeof data == 'object') {
		return data;
	} else {
		try {
			data = JSON.parse(data);
		} catch (error) {
			data = {};
		}
		return data;
	}
}
