const colors = require("tailwindcss/colors");

module.exports = {
  // purge: ["./src/renderer/**/*.{html,js,ts,jsx,tsx}"],
  purge: ["src/**/*.tsx", "src/**/*.css"],
  darkMode: "class", // or 'media' or 'class'
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      // Build your palette here
      transparent: "transparent",
      current: "currentColor",
      gray: colors.trueGray,
      red: colors.red,
      blue: colors.lightBlue,
      yellow: colors.amber,
      green: colors.lime,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("nightwind")],
};
