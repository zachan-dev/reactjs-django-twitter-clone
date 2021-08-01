const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
    const isProd = env.production;
    const CSSExtract = new MiniCssExtractPlugin({ // extract styles into a seperate file with mapping
        filename: 'styles.css',
    });

    return {
        entry: './src/index.js',
        plugins: [
            CSSExtract
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader"
                    }
                }, {
                    test: /\.s?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                url: false,
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ]
        },
        mode: isProd ? 'production' : 'development',
        devtool: isProd ? 'source-map' : 'inline-source-map', // source maps
    };
  };