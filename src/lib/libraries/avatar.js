// https://github.com/laurentpayot/minidenticons

export const identicon = (t, e = 50, i = 50) => {
	const n = t.split('').reduce((t, e) => 16777619 * ((t ^ e.charCodeAt(0)) >>> 0), 2166136261);
	const s = ((n / 16777619) % 18) * 20;
	return (
		[...Array(t ? 25 : 0)].reduce(
			(t, e, i) =>
				n % (16 - (i % 15)) < 4
					? t +
					  `<rect x="${i > 14 ? 7 - ~~(i / 5) : ~~(i / 5)}" y="${i % 5}" width="1" height="1"/>`
					: t,
			`<svg viewBox="-1.5 -1.5 8 8" xmlns="http://www.w3.org/2000/svg" fill="hsl(${s} ${e}% ${i}%)">`
		) + '</svg>'
	);
};

export const getProfilePicture = (store, pubkey, name) => {
	//a const to =  get profile picture from: db/store/auto generated.
};

if (!String.prototype.hasOwnProperty('sum')) {
	Object.defineProperty(String.prototype, 'sum', {
		value() {
			return this.replace(/[^0-9]/g, '')
				.split('')
				.map((a) => parseInt(a))
				.reduce((a, b) => a + b);
		}
	});

	Object.defineProperty(String.prototype, 'sumChar', {
		value() {
			return this.split('')
				.map((a) => a.charCodeAt(0))
				.reduce((a, b) => a + b);
		}
	});

	Object.defineProperty(String.prototype, 'sumCharPos', {
		value() {
			return (
				//Returns Upto 20 digit number.
				Math.round(
					this.split('')
						.map((a) => (isNaN(a) ? a.charCodeAt(0) : parseInt(a)))
						.reduce((a, b, currentIndex) => {
							return (a + b) * (currentIndex - 30);
						}) / 6e35
				)
			);
		}
	});

	//.reduce((t, e) => 16777619 * ((t ^ e.charCodeAt(0)) >>> 0), 2166136261)

	// Object.defineProperty(Array.prototype, 'shuffle', {
	// 	value() {
	// 		return this.map((value) => ({ value, sort: Math.random() }))
	// 			.sort((a, b) => a.sort - b.sort)
	// 			.map(({ value }) => value);
	// 	}
	// });
}

const componentToHex = (c) => {
	var hex = c.toString(16);
	return hex.length == 1 ? '0' + hex : hex;
};

const rgbToHex = (r, g, b) => {
	return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const minmax = (num, min, max) => Math.min(Math.max(num, min), max);

const seedToParams = (seed) => {
	if (seed.length != 64) {
		return false;
	}

	//Position of the letter in the string is also important
	//Number position + num value?

	const variety1 = (v) => Math.round((((v / 3.14) % 14) * 100) / 4.396153365804917);
	const variety2 = (v) => Math.round(((v % 13) / 3847544) * 1e8);

	const p0 = seed.sum();

	const p1 = seed.slice(0, 32);
	const p1a = p1.sum();
	const p1b = p1.sumChar();
	const p1c = p1.sumCharPos();
	// const p1cBase = p1c / 7e-24;
	const p1cNormal = Math.round((p1c * (p1c % 13)) / 17);

	const p2 = seed.slice(32);
	const p2a = p2.sum();
	const p2b = p2.sumChar();
	const p2c = p2.sumCharPos();
	// const p2cBase = p2c / 7e-24;
	const p2cNormal = Math.round((p2c * (p2c % 13)) / 17);

	let r = p1c;

	let g = Math.round(p2c / 2e-23 / 2);
	g = g > 255 ? g - 255 : g;
	g = minmax(variety1(g), 0, 255);

	let b = minmax(variety2(r), 0, 255);

	//p1a; //p0;

	const hex1 = rgbToHex(p0, p1a, p2a);
	const hex2 = rgbToHex(r, g, b);

	return {
		hashes: [p0, p1a, p1cNormal, p2a, p2cNormal],
		colors: [
			{
				r,
				g,
				b,
				hex: rgbToHex(r, g, b)
			},
			{
				r: p0,
				g: p1a,
				b: p2a,
				hex: rgbToHex(p0, p1a, p2a)
			},
			{
				r: p1cNormal,
				g: p2a,
				b: p2cNormal,
				hex: rgbToHex(p1cNormal, p2a, p2cNormal)
			}
		]
	};
};

// //Log 1
// console.table(testSeeds.map((seed) => seedToParams(seed)));

// console.table(
// 	testSeeds.map((seed) => {
// 		let d = seedToParams(seed);
// 		return { d.colors[0] };
// 	})
// );

// //Log2
// testSeeds.forEach((seed) => {
// 	let vals = seedToParams(seed);
// 	console.log(
// 		`%c        %c        %c        `,
// 		`background: ${vals.colors[0].hex};`,
// 		`background: ${vals.colors[1].hex};`,
// 		`background: ${vals.colors[2].hex};`,
// 		//
// 		// `%c ${vals.hex2}`,
// 		vals
// 	);
// });

// testSeeds.forEach((seed) => {
// 	let vals = seedToParams(seed);
// 	console.log(
// 		`%c        %c        `,
// 		`background: ${vals.colors[0].hex};`,
// 		`background: ${vals.colors[1].hex};`,
// 		{ ...vals.hashes }
// 	);
// });
