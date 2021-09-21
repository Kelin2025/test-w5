// const path = require("path");

// const tailwindParams = require("./src/shared/ui/tailwind.params.js");

const Breakpoint = { phone: 0, tablet: 0, laptop: 0, desktop: 0 };

// tailwind.config.js
module.exports = {
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    // extend: require("./src/shared/ui/tailwind.theme.js"),
    screens: {
      phone: `${Breakpoint.phone}px`,
      tablet: `${Breakpoint.tablet}px`,
      laptop: `${Breakpoint.laptop}px`,
      desktop: `${Breakpoint.desktop}px`,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // require("@tailwindcss/aspect-ratio"),
    // require("@tailwindcss/line-clamp"),
  ],
};
