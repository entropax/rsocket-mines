const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const URL = "wss://xlocalhost:9000"
const KEEPALIVE = 60000
const LIFETIME = 180000

module.exports = {
  entry: "./app.js",
  mode: "development",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: false,
    port: 9000,
  },
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
    },
  },
  plugins: [
    new Dotenv({
      path: '../configs/default.env',
    }),
    new webpack.DefinePlugin({
      'process.env.KEEPALIVE': JSON.stringify(process.env.KEEPALIVE || 60000),
      'process.env.LIFETIME': JSON.stringify(process.env.LIFETIME || 180000),
      'process.env.URL': JSON.stringify(process.env.URL || URL)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }],
  },
}
