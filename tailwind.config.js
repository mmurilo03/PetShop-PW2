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
            primaria: {DEFAULT: '#1501A1', light: "#2205eb", lighter: "#5992FF"},
            secundaria: {DEFAULT: '#D9D9D9'},
        },
        width: {
            100: "38rem",
        },
        screens:{
          xsm: '320px',
        }
      },
    },
    plugins: [
      require("tailwindcss-animate"),
    ],
  }