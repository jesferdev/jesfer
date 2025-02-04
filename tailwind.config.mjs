/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ["InterVariable", "Inter", ...defaultTheme.fontFamily.sans],
			},
			animation: {
				"moving-background": "moving-background 5s ease-in-out",
				typing: "typing 2s steps(33)",
			  },
			  keyframes: {
				"moving-background": {
				  "0%": {
					transform: "translateY(0)",
					opacity: 0,
				  },
				  "66%": {
					opacity: 0.4,
				  },
				  "100%": {
					transform: "translateY(-150px)",
					opacity: 0,
				  },
				},
				typing: {
				  "0%": {
					width: "0%",
				  },
				  "100%": {
					width: "100%",
				  },
				},
			  },
			  minHeight: {
				"screen-home": "calc(100vh - 64px)",
			  },
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
