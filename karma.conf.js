var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    browsers: [ 'PhantomJS' ],
    singleRun: true, //just run once by default
    frameworks: [ 'chai', 'mocha' ], //use the mocha test framework
    plugins: [
     'karma-phantomjs-launcher',
     'karma-chai',
     'karma-mocha',
     'karma-sourcemap-loader',
     'karma-webpack',
    ],
    files: [
      'webpack.tests.config.js' //just load this file
    ],
    preprocessors: {
      'webpack.tests.config.js': [ 'webpack', 'sourcemap' ] //preprocess with webpack and our sourcemap loader
    },
    reporters: [ 'dots' ], //report results in this format
    singleRun: true,
    webpack: { //kind of a copy of your webpack config
      devtool: 'inline-source-map', //just do inline source maps instead of the default
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader' }
        ],
        plugins: [
          new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
          })
        ]
      }
    },
    webpackServer: {
      noInfo: true //please don't spam the console when running in karma!
    }
  });
};
