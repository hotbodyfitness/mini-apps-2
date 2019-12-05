module.exports = {
  entry: __dirname + '/client/index.js',
  module: {
    rules: [
      {
        test: /\.js|jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js'
  }
}