/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
	content: [
		"./index.html",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {}
		}
	},
	plugins: [require("tailwindcss-animate")],
}