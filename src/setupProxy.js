const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://deverp.narayanseva.org',
      changeOrigin: true,
      secure: true,
      pathRewrite: { '^/api': '' },
      onProxyReq: (proxyReq, req) => {
        //console.log('[PROXY]', req.method, req.url, '→', proxyReq.path);
      },
    }),
  );
};
