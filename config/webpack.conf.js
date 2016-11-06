var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var projectRoot = path.resolve(__dirname, '..');
var srcRoot = path.resolve(projectRoot, 'src');

module.exports = {
  devtool: 'inline-source-map',
  context: srcRoot,
  resolve: {
    extensions: ['.js']
  },
  entry: {
    app: './index.js',
    dependencies: './dependencies.js',
    polyfills: './polyfills.js'
  },
  output: {
    path: path.resolve(projectRoot, 'dist'),
    filename: '[name].js'
  },
  cache: true,
  module: {
    loaders: [
      { // jquery loader
        test: require.resolve("jquery"),
        loader: "expose?$!expose?jQuery",
        include: /node_modules/
      },
      { // Babel loader
        test: /\.js$/,
        loader: 'babel-loader',
        include: [srcRoot]
      },
      { // CSS loader
        test: /\.css$/,
        include: /node_modules/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
     //     {loader: 'postcss-loader'}
        ]
      },
      { // Scss loader
        test: /\.scss$/,
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              camelCase: true,
              modules: true,
              localIdentName: '[local]__[name]'
            }
          },
       //   {loader: 'postcss-loader'},
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'compressed'
            }
          }
        ],
        include: [srcRoot],
        exclude: [path.resolve(srcRoot, 'assets')]
      },
      { // Scss loader for assets
        test: /\.scss$/,
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              camelCase: true,
              modules: true,
              localIdentName: '[local]__[name]'
            }
          },
        //  {loader: 'postcss-loader'},
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'compressed'
            }
          }
        ],
        include: [path.resolve(srcRoot, 'assets')]
      },
      {
        test: /\.pug$/,
        loader: 'pug-html-loader'
      },
      { // Image loader
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: 'icons/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      }
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.js($|\?)/i
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'dependencies', 'polyfills']
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body'
    }),
    new webpack.LoaderOptionsPlugin({
      context: srcRoot,
      output: {
        path: path.resolve(projectRoot, 'dist'),
        filename: '[name].js'
      }
    })
  ],
  node: {
    fs: 'empty',
    global: true,
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  },
  devServer: {
    contentBase: './dist',
    port: 3000,
    quiet: false,
    noInfo: false,
    lazy: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: true,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  }
};
