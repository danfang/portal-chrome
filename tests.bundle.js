require('es6-promise').polyfill();
require('isomorphic-fetch');

var context = require.context('./test', true, /\.spec\.js$/);
context.keys().forEach(context);
module.exports = context;
