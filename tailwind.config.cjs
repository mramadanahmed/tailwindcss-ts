/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tw.style.ts"],
  theme: {
    colors: {
      primary: "#FF0000",
      red: {
        100: "#00FF00",
        200: "#005544",
      },
    },
    extend: {
      colors: {
        primary: "#FF0000",
        red: {
          100: "#00FF00",
          200: "#005544",
        },
      },
    },
  },
  plugins: [],
};
