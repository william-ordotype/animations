const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const dotenv = require("dotenv");
const webpack = require("webpack");
dotenv.config();

const environmentVariables = ["TEST"];

module.exports = {
  entry: {
    "my-documents": path.resolve(__dirname, "src/pages/my-documents/index.js"),
    pathologies: path.resolve(__dirname, "src/pages/pathologies/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.svg/,
        type: "asset/inline",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack App",
      filename: "index.html",
      chunks: ["my-documents"],
      template: "src/template.html",
    }),
    new HtmlWebpackPlugin({
      template: "./src/pathologies.html",
      chunks: ["pathologies"],
      filename: "pathologies.html",
    }),
    new webpack.EnvironmentPlugin(environmentVariables),
  ],
};
