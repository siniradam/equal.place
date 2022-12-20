// https://github.com/laurentpayot/minidenticons

export function identicon(t, e = 50, i = 50) {
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
}
