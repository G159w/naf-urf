const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	  ],
	
		darkMode: 'media', // or 'media' or 'class'
	  theme: {
			screens: {},
		  fontFamily: {
				sans: ['Graphik', 'sans-serif'],
				serif: ['Merriweather', 'serif'],
		  },
		  extend: {},
	  },
	  plugins: [
		  require('flowbite/plugin'),
		  require('flowbite-typography')
	  ],
};
