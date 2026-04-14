const proxy = require('http-proxy-middleware');

const proxyTarget =
  process.env.REACT_APP_PROXY_TARGET || 'https://deverp.narayanseva.org';

delete process.env.HTTP_PROXY;
delete process.env.HTTPS_PROXY;
delete process.env.http_proxy;
delete process.env.https_proxy;

module.exports = function setupProxy(app) {
  app.use(
    proxy('/erp', {
      target: proxyTarget,
      changeOrigin: true,
      secure: false,
      proxyTimeout: 120000,
      timeout: 120000,
      logLevel: 'warn',
    })
  );
};
