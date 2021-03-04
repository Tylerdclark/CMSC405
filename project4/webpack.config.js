const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const debug = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: "./src/js/main.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js",
    },
    plugins:[
        new HtmlWebpackPlugin({
            filename: 'src/index.html'
          }),
          new webpack.DefinePlugin({
            __DEV__: debug
          }),
          new webpack.LoaderOptionsPlugin({
            debug: true
          })
    ],
    resolve:{
        roots: [
            path.resolve(path.resolve(__dirname), 'src/js'),
            path.resolve(path.resolve(__dirname), 'src')
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"],
                    },
                },
            },
            {
                test: /\.glsl$/,
                use:{
                  loader: "webpack-glsl-loader",
                }
            },
        ],
    },
    performance: {
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000,
    },
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        publicPath: "/public/",
        compress: true,
        port: 9000,
        hot: true,
    },
    devtool: debug ? 'eval-source-map' : 'source-map'
};
