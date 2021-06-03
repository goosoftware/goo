module.exports = {
  // purge: ["./src/renderer/**/*.{html,js,ts,jsx,tsx}"],
  purge: ["src/**/*.tsx", "src/**/*.css"],
  darkMode: "class", // or 'media' or 'class'
  darkMode: "class",
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    // require("nightwind")
  ],
};
