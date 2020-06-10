const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: "./public/javascripts/frontend.js",
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: "bundle.js",
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            importLoaders: 1
          }
        },
        "postcss-loader",
      ],
    }, {
      test: /\.(js)$/
    }],
  }
}