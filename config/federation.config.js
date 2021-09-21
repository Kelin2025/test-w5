const dependencies = require("../package.json").dependencies;

module.exports = {
  name: "app_bootstrap_remote",
  library: { type: "var", name: "app_bootstrap_remote" },
  filename: "app-bootstrap.js", // expose it as `app-shell.js
  remotes: {},
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: dependencies.react,
    },
    "react-dom": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["react-dom"],
    },
    "react-router-dom": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["react-router-dom"],
    },
    "react-intl": {
      import: "react-intl",
      shareKey: "react-intl",
      shareScope: "default",
      singleton: true,
      eager: true,
      requiredVersion: dependencies["react-intl"],
    },
    "@frs/i18n-store": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["@frs/i18n-store"],
    },
    "@frs/mfe-configs-store": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["@frs/mfe-configs-store"],
    },
    "@frs/response-handle-middleware": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["@frs/response-handle-middleware"],
    },
    "@frs/common-info": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["@frs/common-info"],
    },
    "@frs/shared-layout-stores": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["@frs/shared-layout-stores"],
    },
    "@frs/logout": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["@frs/logout"],
    },
    "@pcbl-ui-v4/toast": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["@pcbl-ui-v4/toast"],
    },
    "@pcbl-ui-v4/icon": {
      singleton: true,
      eager: true,
      requiredVersion: dependencies["@pcbl-ui-v4/icon"],
    },
  },
};
