// Conjuring the styling spirits from the pixel realm...
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The haunted palette from the depths
        'gameboy-green': '#0f380f',
        'blood-red': '#8b0000',
        'ghostly-blue': '#e0ffff',
      },
    },
  },
  plugins: [],
}
