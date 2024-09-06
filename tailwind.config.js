/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ["Roboto", "sans-serif"],
        },
        colors: {
            primaria: {DEFAULT: '#1501A1'},
        },
        width: {
            100: "38rem",
        }
      },
    },
    plugins: [],
  }