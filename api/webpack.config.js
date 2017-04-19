const path = require('path');

module.exports = {
  entry: '../app/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist', 'js')
 },
 module: {
	loaders: [
	  {
		 test: /\.jsx?$/,
		 loader: 'babel-loader',
		 exclude: /node_modules/,
		 query: {
			presets: ['env', 'react']
		 }
	  }
	]
 }
}
