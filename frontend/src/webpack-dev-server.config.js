const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');


 const BabiliPlugin = require("babili-webpack-plugin");
 const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractPlugin = new ExtractTextPlugin({
    filename: 'bundle.css'
});

const config = {
    // Entry points to the project
    entry: {
        app: [
            // only- means to only hot reload for successful updates
            // 'webpack/hot/only-dev-server', HERE
            './src/entrypoint.js',
        ],
    },
    // Server Configuration options
    devServer: {
        contentBase: 'www', // Relative directory for base of server
        hot: true, //false, // Live-reload HERE
        inline: true, // HERE
        port: 3050, // Port Number
        host: '0.0.0.0', // Change to '0.0.0.0' for external facing server
        historyApiFallback: true,
    },
    devtool: 'cheap-module-source-map', // '#cheap-module-source-map', eval
    output: {
        path: path.resolve(__dirname, 'build'), // Path of output file
        filename: `[name].js`,
    },
    plugins: [
        // Enables Hot Modules Replacement
        new webpack.HotModuleReplacementPlugin(),

        new CopyWebpackPlugin([
            {from: 'www'}]),
        extractPlugin,

    ],
    resolve: {

        // root: path.join(__dirname, './src'),
        alias: {
            actions: 'actions',
            assets: 'assets',
            components: 'components',
            constants: 'constants',
            containers: 'containers',
            pages: 'pages',
            reducers: 'reducers',
            stores: 'stores',
            sagas: 'sagas',
            utils: 'utils',
            _: "lodash",
        },
        // modulesDirectories: ["node_modules"],
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                },
            },
            {
                test: /\.scss$/,
                use: extractPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.less$/,
                use: extractPlugin.extract({
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.css/,
                use: extractPlugin.extract({
                    use: ['style-loader', 'css-loader']
                })
            },

            {
                test: /\.svg/,
                loader: "url-loader?limit=26000&mimetype=image/svg+xml"
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=public/fonts/[name].[ext]'
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.gif$/,
                loader: "url-loader?limit=10000&mimetype=image/gif"
            },
            {
                test: /\.jpg$/,
                loader: "url-loader?limit=10000&mimetype=image/jpg"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=10000&mimetype=image/png"
            },
            {
                test: /\.svg/,
                loader: "url-loader?limit=26000&mimetype=image/svg+xml"
            },
            {
                test: /\.jsx$/,
                loader: "react-hot!babel",
                exclude: [/node_modules/, /public/]
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            // // Font Definitions
            {test: /\.woff$/, loader: 'url?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]'},
            {
                test: /\.woff2$/,
                loader: 'url?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]'
            },
            {
                test: /\.[ot]tf$/,
                loader: 'url?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]'
            },
            {
                test: /\.eot$/,
                loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]'
            }
        ]
    },
};

module.exports = config;
