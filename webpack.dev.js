const webpack = require('webpack');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const webpackBaseConfig = require('./webpack.base');

module.exports = () => ({
  ...webpackBaseConfig,
  /*
   * Add the rest of the DEVELOPMENT environment required configs here
   */
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  output: {
    filename: 'dev-[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      ...webpackBaseConfig.module.rules,
      /*
       * Add the rest of the DEVELOPMENT environment required modules here
       */
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: 'tsconfig.dev.json'
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...webpackBaseConfig.plugins,
    /*
     * Add the rest of the DEVELOPMENT environment required plugins here
     */
    new webpack.WatchIgnorePlugin({
      paths: [
        /css\.d\.ts$/
      ],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
});
