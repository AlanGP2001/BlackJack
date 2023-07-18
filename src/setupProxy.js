const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://smiley-blackjack-game.netlify.app',
            changeOrigin: true,
        })
    );
};
