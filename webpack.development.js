var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: [
        'webpack-dev-server/client?http://tomatoestogether',
        './index'
    ],
    output: {
        path: path.join(__dirname, 'assets'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.jsx', '.js', '.ts', '.tsx'],
        alias: {
            src: path.join(__dirname, 'src')
        }
    },
    module: {
        loaders: [{
            test: /\.tsx?$/,
            loaders: ['awesome-typescript-loader'],
            include: path.join(__dirname, '.')
        }, {
            test: /\.css$/,
            loaders: ['ignore-loader']
        }]
    }
};
