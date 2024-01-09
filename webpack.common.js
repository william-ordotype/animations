const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    // "my-documents": path.resolve(__dirname, "src/pages/my-documents/index.js"),
    pathologies: path.resolve(__dirname, "src/pages/pathologies/index.js"),
    "my-shared-documents": path.resolve(
      __dirname,
      "src/pages/my-shared-documents/index.js"
    ),
    "document-shared-invite": path.resolve(
      __dirname,
      "src/pages/document-shared-invite/index.js"
    ),
    "my-notes": path.resolve(__dirname, "src/pages/my-notes/index.js"),
    store: path.resolve(__dirname, "src/pages/store/index.js"),
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
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
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
    // new HtmlWebpackPlugin({
    //   title: "Ordotype | My Documents",
    //   filename: "index.html",
    //   chunks: ["my-documents"],
    //   template: "./src/pages/my-documents/template.html",
    // }),
    new HtmlWebpackPlugin({
      title: "Ordotype | Pathologies",
      template: "./src/pages/pathologies/template.html",
      chunks: ["pathologies"],
      filename: "pathologies.html",
    }),
    new HtmlWebpackPlugin({
      title: "Ordotype | My Shared Documents",
      template: "./src/pages/my-shared-documents/template.html",
      chunks: ["my-shared-documents"],
      filename: "my-shared-documents.html",
    }),
    new HtmlWebpackPlugin({
      title: "Ordotype | Document Shared Invite",
      template: "./src/pages/document-shared-invite/template.html",
      chunks: ["document-shared-invite"],
      filename: "document-shared-invite.html",
    }),
    new HtmlWebpackPlugin({
      title: "Ordotype | My notes",
      template: "./src/pages/my-notes/template.html",
      chunks: ["my-notes"],
      filename: "my-notes.html",
    }),
  ],
};
