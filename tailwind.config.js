/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        patron: ["Patron"],
        iconbold: "Iconbold",
        iconreg: "Iconreg",
      },
      colors: {
        blue: "#2e1aae",
        white: "#f5f5ff",
        bg: "#1e293b",
      },
    },
  },
  plugins: [],
};
