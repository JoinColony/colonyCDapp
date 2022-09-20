/*
 * @NOTE This file exports just the BASE configuration object.
 * This cannot be directly plugged into webpack as that expects a function.
 * For the final config objects look into webpack.dev.js and webpack.prod.js
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const mode = process.env.NODE_ENV || 'development';

const config = {
  entry: './src/index.ts',
  mode,
  resolve: {
    alias: Object.assign(
      {},
      {
        '~shared': path.resolve(__dirname, 'src/components/shared'),
        '~common': path.resolve(__dirname, 'src/components/common'),
        '~root': path.resolve(__dirname, 'src/components/root'),
        '~gql': path.resolve(__dirname, 'src/graphql'),
        '~constants': path.resolve(__dirname, 'src/constants'),
      //   '~externalUrls': path.resolve(__dirname, 'src/modules/externalUrls'),
        '~context': path.resolve(__dirname, 'src/context'),
        '~lib': path.resolve(__dirname, 'src/lib'),
      //   '~data': path.resolve(__dirname, 'src/data'),
        '~redux': path.resolve(__dirname, 'src/redux'),
      //   '~routes': path.resolve(__dirname, 'src/routes'),
        '~utils': path.resolve(__dirname, 'src/utils'),
        '~styles': path.resolve(__dirname, 'src/styles/shared'),
      //   '~testutils': path.resolve(__dirname, 'src/__tests__/utils.ts'),
        '~types': path.resolve(__dirname, 'src/types'),
      //   '~dialogs': path.resolve(__dirname, 'src/modules/dashboard/components/Dialogs')
        '@colony/colony-js': path.resolve(__dirname, 'node_modules/@colony/colony-js'),
      },
    ),
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src', 'components'),
          path.resolve(__dirname, 'src', 'styles'),
        ],
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              modules: true,
              namedExport: true,
              camelCase: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64:8]',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        include: [
          path.resolve('node_modules', 'draft-js'),
          path.resolve('node_modules', 'rc-slider'),
        ],
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|png|jpe?g|gif)$/,
        loader: 'file-loader',
        include: [
          path.resolve('src'),
        ],
        options: {
          esModule: false,
        },
      },
      /*
       * To load svg icons and token icons to import
       */
      {
        test: /\.svg$/,
        exclude: [
          path.resolve(__dirname, 'src', 'img', 'icons')
        ],
        use: '@svgr/webpack',
      },
      /*
       * We are only parsing images inside `src/client/img/icons`. Doing so allows us to bundle the commonly-used icons.
       * This loader also runs the images through a svg optimizer. See: https://github.com/svg/svgo#what-it-can-do
       * To use with Icon component
       */
      {
        test: /\.svg$/,
        include: [
          path.resolve(__dirname, 'src', 'img', 'icons')
        ],
        use: [
          {
            loader: 'svg-sprite-loader',
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
              ],
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [
          path.resolve(__dirname, 'src', 'img', 'tokens'),
        ],
        use: [
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
                { removeViewBox: false },
                { removeDimensions: true },
              ],
            },
          },
        ],
      },
    ],
  },
  node: {
    net: 'empty',
    child_process: 'empty',
    fs: 'empty',
  },
  plugins: [
    new Dotenv({
      systemvars: !!process.env.CI || !!process.env.DEV,
    }),
    new HtmlWebpackPlugin({
      template: 'src/templates/index.html',
      favicon: 'src/img/favicon.png',
    }),
  ],
  /*
   * Fix for the XMLHttpRequest compile-time bug.
   *
   * See for more details:
   * https://github.com/webpack/webpack-dev-server/issues/66
   */
  externals: [
    {
      xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
    },
  ],
};

module.exports = config;
