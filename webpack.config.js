var path = require("path");

module.exports = {
    entry: {
        Kan : "./src/Kan.js",
        SampleBackbone: "./sampleApps/backboneApp.js",
        SampleReact: "./sampleApps/reactApp.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/assets/",
        filename: "[name].bundle.js"
    },
    resolve: {
        alias: {
            'backbone': require.resolve('backbone')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['latest']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ]
    }
};
