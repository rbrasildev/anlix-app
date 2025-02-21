import { fontFamilly } from "./app/styles/fontFamilly"
import { colors } from "./app/styles/colors"
/** @type {import('tailwindcss').Config} */
module.exports = {

  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamilly,
      colors
    },
  },
  plugins: [],
}