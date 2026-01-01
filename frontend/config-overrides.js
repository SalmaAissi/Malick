module.exports = function override(config, env) {
    if (!config.devServer) {
        config.devServer = {};
    }
    config.devServer.headers = {
        'Content-Type': 'text/html; charset=utf-8'
    };
    return config;
};