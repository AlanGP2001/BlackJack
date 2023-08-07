const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: `${process.env.DB_COPY}`,
            //target: 'https://proyecto-de-matematicas-blackjack.netlify.app',
            changeOrigin: true,
        })
    );
};
