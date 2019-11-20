module.exports = {
  entry: __dirname + '/client/app.jsx',
  module: {
    rules: [
      {
        test: /\.js|jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  }
};