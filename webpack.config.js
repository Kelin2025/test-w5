const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssImport = require("postcss-import");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
require("dotenv").config();

const federationConfig = require("./config/federation.config");

// need bundle analyze
const isNeedBundleAnalyzer = process.env.BUNDLE_ANALYZER;

const mode = process.env.NODE_ENV || "development";
const isProdMode = mode === "production";
const port = process.env.PORT;

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === "true") {
    return false;
  }

  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
})();

module.exports = {
  mode,
  entry: "./src/index",
  output: {
    publicPath: "/",
    path: path.resolve(process.cwd(), "build"),
    filename: isProdMode ? "[name].[contenthash].js" : "[name].js",
  },
  devtool: isProdMode ? "source-map" : "inline-source-map",
  devServer: {
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, "public"),
      publicPath: "/public/",
      watch: true,
    },
    onBeforeSetupMiddleware({ app, server }) {
      app.use(errorOverlayMiddleware());
    },
  },
  optimization: {
    minimize: isProdMode,
    minimizer: [`...`, new CssMinimizerPlugin()],
    splitChunks: { chunks: "all" },
  },
  resolve: {
    extensions: ["*", ".js", ".ts", ".tsx"],
    alias: {
      "@": path.join(__dirname, "/src"),
    },
    fallback: {
      fs: false,
      os: false,
      vm: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      util: false,
      https: false,
      stream: false,
      crypto: false,
      esbuild: false,
      module: false,
      child_process: false,
      worker_threads: false,
    },
  },
  module: {
    strictExportPresence: true,
    parser: {
      javascript: {
        // NOTE: Disable `require.ensure` as it's not a standard language
        //       feature.
        requireEnsure: false,
      },
    },
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
          },
        ],
      },
      {
        test: /\.(jpe?g|png|webp)$/i,
        type: "asset",
        // use: [
        //   {
        //     loader: "responsive-loader",
        //     options: {
        //       adapter: require("responsive-loader/sharp"),
        //     },
        //   },
        // ],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        type: "asset/resource",
      },
      {
        test: /\.(css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader", // postcss loader needed for tailwindcss
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [postcssImport, tailwindcss(), autoprefixer],
              },
            },
          },
        ],
      },
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader", // postcss loader needed for tailwindcss
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [postcssImport, tailwindcss(), autoprefixer],
              },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    ...(isProdMode ? [new CompressionPlugin()] : []),
    new CleanWebpackPlugin(),
    // new ModuleFederationPlugin(federationConfig),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: isProdMode ? "[name].[contenthash].css" : "[name].css",
    }),
    new ESLintPlugin({
      // Plugin options
      extensions: ["js", "mjs", "jsx", "ts", "tsx"],
      formatter: require.resolve("react-dev-utils/eslintFormatter"),
      eslintPath: require.resolve("eslint"),
      failOnError: !isProdMode,
      context: path.resolve(__dirname, "src"),
      cache: true,
      cacheLocation: path.resolve(__dirname, ".cache", ".eslintcache"),
      // ESLint class options
      cwd: path.resolve("."),
      resolvePluginsRelativeTo: __dirname,
      baseConfig: {
        extends: [require.resolve("eslint-config-react-app/base")],
        rules: {
          ...(!hasJsxRuntime && {
            "react/react-in-jsx-scope": "error",
          }),
        },
      },
    }),
    ...(isNeedBundleAnalyzer ? [new BundleAnalyzerPlugin()] : []),
  ],
  performance: {
    hints: false,
  },
  stats: {
    preset: isProdMode ? "errors-warnings" : "errors-warnings",
    errorDetails: true,
  },
  target: "browserslist",
};
