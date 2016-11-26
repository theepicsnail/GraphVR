module.exports = {
  context: __dirname,
  entry: "./main.ts",
  output: {
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['', '.webpack.js', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
};
