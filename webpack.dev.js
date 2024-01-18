const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');

const webpackBaseConfig = require('./webpack.base').config;

module.exports = () => ({
  ...webpackBaseConfig,
  /*
   * Add the rest of the DEVELOPMENT environment required configs here
   */
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    hot: !process.env.WEBPACK_DISABLE_HOT_RELOAD,
    client: process.env.WEBPACK_DISABLE_HOT_RELOAD
      ? false
      : {
          logging: 'error',
        },
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
              configFile: 'tsconfig.dev.json',
              getCustomTransformers: () => ({
                before: [ReactRefreshTypeScript()],
              }),
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
    new ReactRefreshWebpackPlugin(),
    new Dotenv({
      systemvars: !!process.env.CI || !!process.env.DEV,
    }),
    new webpack.WatchIgnorePlugin({
      paths: [/css\.d\.ts$/],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      excludeAssets: /dev-vendors|dev-node|dev-main/,
    }),
    new webpack.DefinePlugin({
      WEBPACK_IS_PRODUCTION: JSON.stringify(false),
    }),
    new webpack.DefinePlugin({
      SAFE_ENABLED_LOCALLY: JSON.stringify(process.env.SAFE === 'enabled'),
    }),
    new webpack.DefinePlugin({
      PROD_COMMIT_HASH: undefined, // only set for production
    }),
  ],
});
