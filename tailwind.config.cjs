const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
	  ],
	
		darkMode: 'class',
	  theme: {
			screens: {},
		  fontFamily: {
				sans: ['Graphik', 'sans-serif'],
				serif: ['Merriweather', 'serif'],
		  },
		  extend: {},
	  },
};
