const dotenv = require("dotenv");
dotenv.config({ path: ".env.dev" });
const webpack = require("webpack");
const { merge } = require("webpack-merge");

const environmentVariables = ["ORDOTYPE_API", "ORDOTYPE_API_VERSION"];

const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = merge(common, {
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new webpack.EnvironmentPlugin(environmentVariables),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
});
