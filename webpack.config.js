module.exports = {
    entry: "./renderGraphs.js",
    output: {
        path: `${__dirname}/target`,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
              test: /\.json$/,
              loader: "json-loader"
            }
        ]
    },
    devtool: 'source-map',
    devServer: { inline: true } 
};