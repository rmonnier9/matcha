const path = require('path');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
 },
 module: {
	loaders: [
	  {
		 test: /\.js$/,
		 loader: 'babel-loader',
		 exclude: /node_modules/,
		 query: {
			presets: ['es2015', 'react']
		 }
	  }
	]
 }
};
