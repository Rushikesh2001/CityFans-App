var webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()],
  entry: "./app.js",
  output: {
    filename: "bundle.js",
    path: "/",
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: "node-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
};
