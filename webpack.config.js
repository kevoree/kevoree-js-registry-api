'use strict';

var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');

module.exports = {
  entry: path.resolve(pkg.main),
  output: {
    filename: path.join('browser', pkg.name + '.js'),
    library: 'KevoreeRegistryApi',
    libraryTarget: 'umd'
  },
  externals: {
    'tiny-conf': 'TinyConf',
    'node-fetch': 'fetch'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
