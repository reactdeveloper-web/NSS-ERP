const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const target =
    process.env.REACT_APP_PROXY_TARGET || 'https://deverp.narayanseva.org';

  app.use(
    ['/api', '/erp'],
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: true,
      pathRewrite: path => path.replace(/^\/api/, ''),
    }),
  );
};
