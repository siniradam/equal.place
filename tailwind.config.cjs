/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: 'rgb(var(--primary) / <alpha-value>)',
				secondary: 'rgb(var(--secondary) / <alpha-value>)',

				passive: 'rgb(var(--passive) / <alpha-value>)',
				panel: 'rgb(var(--panel) / <alpha-value>)',
				content: 'rgb(var(--content) / <alpha-value>)',
				body: 'rgb(var(--body) / <alpha-value>)',
				danger: 'rgb(var(--danger) / <alpha-value>)',
				warn: 'rgb(var(--warn) / <alpha-value>)',
				like: 'rgb(var(--like) / <alpha-value>)',
				actionOne: 'rgb(var(--actionOne) / <alpha-value>)',
				actionTwo: 'rgb(var(--actionTwo) / <alpha-value>)',
				actionThree: 'rgb(var(--actionThree) / <alpha-value>)'
			},
			fontFamily: {
				gantari: ['Gantari'],
				figtree: ['Figtree']
			}
		}
	},
	plugins: []
};
