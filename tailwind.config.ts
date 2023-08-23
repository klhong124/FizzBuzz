/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./**/*.vue", "./nuxt.config.{js,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#62A8FF",
        secondary: "#47D48C",
        highlight: "#FFD907",
      },
    },
    plugins: [],
  },
};
