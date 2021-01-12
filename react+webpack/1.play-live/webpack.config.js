const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    index: './src/index.tsx'
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" })
  ],
  devServer: {
    public: "localhost:1234",
    port: 1234
  },
  output: {
    publicPath: "/",
  }
}
