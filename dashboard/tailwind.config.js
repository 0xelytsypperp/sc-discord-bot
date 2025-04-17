/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skinDark: "#0b0c10",
        skinPanel: "#1f2833",
        skinAccent: "#66fcf1",
        skinTextSubtle: "#c5c6c7",
        skinButton: "#45a29e",
        skinButtonHover: "#66fcf1"
      }
    },
  },
  plugins: [],
}
