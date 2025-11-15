// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v3',
    createProxyMiddleware({
      target: 'https://api.coingecko.com',
      changeOrigin: true,
    })
  );
};