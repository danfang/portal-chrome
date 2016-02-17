var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    browsers: [ 'PhantomJS' ],
    singleRun: true,
    frameworks: [ 'chai', 'mocha', 'sinon' ],
    plugins: [
     'karma-chai',
     'karma-mocha-reporter',
     'karma-mocha',
     'karma-phantomjs-launcher',
     'karma-sinon',
     'karma-sourcemap-loader',
     'karma-webpack',
    ],
    files: [
      'tests.bundle.js'
    ],
    preprocessors: {
      'tests.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'mocha' ],
    singleRun: true,
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader' }
        ],
      }
    },
    webpackServer: {
      noInfo: true
    }
  });
};
