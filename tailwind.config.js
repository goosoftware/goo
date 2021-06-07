const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["src/renderer/**/*.{ts,tsx,html,css}"],
  darkMode: "class",
  theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      current: "currentColor",
      gray: colors.trueGray,
      red: colors.red,
      blue: colors.lightBlue,
      yellow: colors.amber,
      green: colors.lime,
      solanaGreen: "#75FAAB",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("nightwind")],
};
