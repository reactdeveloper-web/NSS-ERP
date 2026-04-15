const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://deverp.narayanseva.org',
      changeOrigin: true,
      secure: true,
      pathRewrite: { '^/api': '' },
      logLevel: 'debug', // ← add this to see proxy logs in terminal
    }),
  );
};
