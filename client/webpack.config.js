const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../static/js/'),
    filename: 'index.js'
  }
};
