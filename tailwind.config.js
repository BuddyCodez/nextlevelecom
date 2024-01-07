/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/theme'
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],

  theme: {
    extend: {},
  },
  plugins: [nextui()],
}