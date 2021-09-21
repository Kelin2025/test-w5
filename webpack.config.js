const path = require("path");
// const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssImport = require("postcss-import");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// const ESLintPlugin = require("eslint-webpack-plugin");
require("dotenv").config();

const federationConfig = require("./config/federation.config");

// need bundle analyze
const isNeedBundleAnalyzer = process.env.BUNDLE_ANALYZER;

const mode = process.env.NODE_ENV || "development";
const isProdMode = mode === "production";
const port = process.env.PORT;

module.exports = {
  mode,
  entry: "./src/index",
  output: {
    publicPath: "/",
    path: path.resolve(process.cwd(), "dist"),
    filename: isProdMode ? "[name].[contenthash].js" : "[name].js",
  },
  devtool: "source-map",
  devServer: {
    host: "0.0.0.0",
    port,
    historyApiFallback: true,
    allowedHosts: [".127-0-0-1.nip.io", ".127.0.0.1.nip.io"],
    static: {
      directory: path.resolve(__dirname, "public"),
      publicPath: "/public/",
      watch: true,
    },
    proxy: [
      {
        changeOrigin: true,
        secure: false,
        ws: true,
        context: [
          "/auth", // keycloak
          "/services", // сервисы backend, file-srv, report итд
          "/static/docs", // скопировано из ../../maintenance/docs/ при сборке bundle, но как это подключить корректно я не знаю.
          "/contexthelp", // статические файлы контекстной помощи
          "/hasura/shard/v1/graphql", // hasura backend
          "/hasura/global/v1/graphql", // hasura global backend
        ],
        target: `https://dev1-88.pcbltools.ru:443`,
        router(req) {
          const LOCAL_HOST_REGEX = /^local-(\d{4})\..*/;
          const { hostname } = req;
          const localHost = LOCAL_HOST_REGEX.exec(hostname);
          if (localHost) {
            return `https://localhost:${localHost[1]}`;
          }
          return null;
        },
        onProxyReq(proxyReq, req) {
          proxyReq.setHeader("X-Forwarded-Host", req.hostname);
          proxyReq.setHeader("X-Forwarded-Port", port);
          proxyReq.setHeader("X-Forwarded-Proto", req.protocol);
        },
      },
    ],
  },
  optimization: {
    minimize: isProdMode,
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  resolve: {
    extensions: [
      ".webpack.js",
      ".web.js",
      ".mjs",
      ".js",
      ".json",
      ".tsx",
      ".ts",
      ".jsx",
    ],
    alias: {
      "@src": path.join(__dirname, "/src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
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
        use: [
          {
            loader: "responsive-loader",
            options: {
              adapter: require("responsive-loader/sharp"),
            },
          },
        ],
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
    ],
  },
  plugins: [
    ...(isProdMode ? [new CompressionPlugin()] : []),
    new CleanWebpackPlugin(),
    new ModuleFederationPlugin(federationConfig),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      dev_config_url: process.env.DEV_URL_CONFIGURATION,
      stand_config_url: isProdMode
        ? process.env.REMOTE_URL_CONFIGURATION
        : `https://dev${process.env.STAND_NUMBER}.pcbltools.ru${process.env.REMOTE_URL_CONFIGURATION}`,
    }),
    new MiniCssExtractPlugin({
      filename: isProdMode ? "[name].[contenthash].css" : "[name].css",
    }),
    ...(isNeedBundleAnalyzer ? [new BundleAnalyzerPlugin()] : []),
  ],
};
