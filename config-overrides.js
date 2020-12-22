module.exports = module.exports = function override(config) {
    config.module.rules.push({
        test: /\.(js?)$/,
        use: {
            loader: 'babel-loader',
        },
    });

    return config;
};