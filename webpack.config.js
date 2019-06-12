const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/entrypoint.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'js/bundle.js',
    }
};
