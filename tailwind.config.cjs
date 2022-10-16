const colors = require('tailwindcss/colors')

const config = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	  ],
	
	  theme: {
		screens: {
			sm: '480px',
			md: '768px',
			lg: '976px',
			xl: '1440px',
		  },
		  fontFamily: {
			sans: ['Graphik', 'sans-serif'],
			serif: ['Merriweather', 'serif'],
		  },
		  extend: {
			spacing: {
			  '128': '32rem',
			  '144': '36rem',
			},
		  },
	  },
	
	  plugins: [
		  require('flowbite/plugin'),
		  require('flowbite-typography')
	  ],
	  darkMode: 'class',
};

module.exports = config;
