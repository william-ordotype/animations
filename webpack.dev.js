const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.dev" });
const webpack = require("webpack");

const environmentVariables = ["ORDOTYPE_API"];

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3021,
    open: false,
    hot: true,
    compress: true,
    historyApiFallback: true,
    server: "https",
  },
  plugins: [new webpack.EnvironmentPlugin(environmentVariables)],
});
