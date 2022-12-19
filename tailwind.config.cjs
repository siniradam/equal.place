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
				body: 'rgb(var(--body) / <alpha-value>)'
			},
			fontFamily: {
				gantari: ['Gantari'],
				figtree: ['Figtree']
			}
		}
	},
	plugins: []
};
