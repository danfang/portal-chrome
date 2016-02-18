require('isomorphic-fetch');
require('babel-polyfill');

var context = require.context('./test', true, /\.spec\.jsx?$/);
context.keys().forEach(context);
module.exports = context;
