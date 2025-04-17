/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skinDark: "#1f2833",
        skinPanel: "#1f2833",
        skinAccent: "#5426FF",
        skinTextSubtle: "#5426FF",
        skinButton: "#CD40A7",
        skinButtonHover: "#5426FF"
      }
    },
  },
  plugins: [],
}
