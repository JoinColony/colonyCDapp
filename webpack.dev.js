const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Dotenv = require('dotenv-webpack');

const webpackBaseConfig = require('./webpack.base').config;

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
              configFile: 'tsconfig.dev.json',
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
  ],
});
