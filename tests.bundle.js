require('es6-promise').polyfill();
require('isomorphic-fetch');

var context = require.context('./test', true, /\.spec\.jsx?$/);
context.keys().forEach(context);
module.exports = context;
