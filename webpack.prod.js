const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const webpackBaseConfig = require('./webpack.base').config;

module.exports = () => ({
  ...webpackBaseConfig,
  /*
   * Add the rest of the PRODUCTION environment required configs here
   */
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          idHint: 'defaultVendors',
          chunks: 'all',
        },
        libs: {
          test: /[\\/]src\/lib[\\/]/,
          idHint: 'libs',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      ...webpackBaseConfig.module.rules,
      /*
       * Add the rest of the PRODUCTION environment required modules here
       */
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    ...webpackBaseConfig.plugins,
    /*
     * Add the rest of the PRODUCTION environment required plugins here
     */
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      WEBPACK_IS_PRODUCTION: JSON.stringify(true),
    }),
  ],
});
