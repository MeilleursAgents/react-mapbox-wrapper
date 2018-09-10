const path = require('path');

const isBuild = process.env.npm_lifecycle_event === 'build';

module.exports = {
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },

    mode: isBuild ? 'production' : 'development',

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['node_modules', './src'],
    },

    externals: {
        react: 'commonjs react',
    },
};
