const tsImportPluginFactory = require('ts-import-plugin')


module.exports = [{
    output: {
        filename: 'static/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.[jte]sx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [tsImportPluginFactory( /** options */)]
                    })
                },
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    entry: './test/index.ts',
}];