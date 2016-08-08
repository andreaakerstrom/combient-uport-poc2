var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('css/screen.css');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    path.resolve(__dirname, 'src/js/index.js'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '/js/bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    extractCSS,
    new CopyWebpackPlugin([
        { from: 'src/img', to: 'img' }
      ],
      {
        ignore: ['*.txt']
      }
    ),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ],
  resolveLoader: {
    'fallback': path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: [nodeModulesPath],
        include: path.join(__dirname, 'src'),
        query: {
          presets:['es2015', 'stage-0', 'react'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, '..', '..', 'src')
      },
      {
        test: /\.scss$/,
        loader: extractCSS.extract(['raw','sass'])
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  devServer: {
    contentBase: "./dist",
    hot: true,
    historyApiFallback: true
  }
};
