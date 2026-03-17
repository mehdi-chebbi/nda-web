/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0d4a2e',
          dark: '#07331f',
          light: '#156642'
        },
        secondary: {
          DEFAULT: '#c9a227',
          light: '#dbb84a'
        },
        bg: {
          primary: '#f5f3ef',
          secondary: '#e8e6e0',
          white: '#ffffff'
        },
        text: {
          primary: '#1a1a1a',
          secondary: '#5a5a5a',
          muted: '#8a8a8a'
        },
        border: {
          DEFAULT: '#d4d2ce',
          light: '#e4e2de'
        }
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      }
    },
  },
  plugins: [],
}
