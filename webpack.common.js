const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    "my-documents": path.resolve(__dirname, "src/pages/my-documents/index.js"),
    pathologies: path.resolve(__dirname, "src/pages/pathologies/index.js"),
    "my-shared-documents": path.resolve(
      __dirname,
      "src/pages/my-shared-documents/index.js"
    ),
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
      title: "Ordotype | My Documents",
      filename: "index.html",
      chunks: ["my-documents"],
      template: "src/template.html",
    }),
    new HtmlWebpackPlugin({
      title: "Ordotype | Pathologies",
      template: "./src/pathologies.html",
      chunks: ["pathologies"],
      filename: "pathologies.html",
    }),
    new HtmlWebpackPlugin({
      title: "Ordotype | My Shared Documents",
      template: "./src/pages/my-shared-documents/template.html",
      chunks: ["my-shared-documents"],
      filename: "my-shared-documents.html",
    }),
  ],
};
