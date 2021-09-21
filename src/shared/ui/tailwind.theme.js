const params = require("./tailwind.params.js");

module.exports = {
  colors: params.colors,
  fontFamily: {
    sans: ["SB Sans Interface", "sans-serif"],
  },
  screens: Object.entries(params.screens).reduce(
    (mappedScreens, [breakpoint, value]) => {
      mappedScreens[breakpoint] = `${value}px`;
      return mappedScreens;
    },
    {}
  ),
  width: params.width,
  maxWidth: params.width,
  minWidth: params.width,
};
