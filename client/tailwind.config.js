/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        polygon: {
          red: '#E03C31',    // Color of the 'Polygon' text
          pink: '#D83363',   // Top-left arc
          purple: '#7F246C', // Top-right block
          yellow: '#F3C340', // Bottom-left arc
          orange: '#D55E36', // Bottom-right arc
          bg: '#FFFBF9',     // Warm light background
        }
      }
    },
  },
  plugins: [],
}
