var webpack = require("./webpack.config.js");

module.exports = function(config) {
    config.set({
        files: [
            './node_modules/babel-polyfill/dist/polyfill.js',
            'dist/**/*.js',
            'tests/**/*.js'
        ],

        browsers: ['PhantomJS'],
        port: 9876,
        colors: true,
        autoWatch: false,
        singleRun: true,
        // frameworks to use
        frameworks: ['mocha', 'chai'],

        reporters: ['spec', 'coverage'],

        coverageReporter: {
            dir: 'reports/',
            reporters: [
                { type: 'html' },
                { type: 'text' },
                { type: 'text-summary' }
            ]
        },

        plugins: [
            require("karma-webpack"),
            require("karma-mocha"),
            require("karma-chai"),
            require("karma-coverage"),
            require("karma-phantomjs-launcher"),
            require("karma-spec-reporter")
        ],

        webpack: webpack,

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            noInfo: true
        },

        preprocessors: {
            'dist/**/*.js': ['webpack', 'coverage'],
            'tests/**/*.js': ['webpack']
        }
    });
};
