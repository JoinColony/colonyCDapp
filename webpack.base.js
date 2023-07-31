/*
 * @NOTE This file exports just the BASE configuration object.
 * This cannot be directly plugged into webpack as that expects a function.
 * For the final config objects look into webpack.dev.js and webpack.prod.js
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';

const svgoPlugins = [
  { removeTitle: true },
  { convertColors: { shorthex: false } },
  { convertPathData: false },
];

const config = {
  mode,
  resolve: {
    alias: Object.assign(
      {},
      {
        '~shared': path.resolve(__dirname, 'src/components/shared'),
        '~common': path.resolve(__dirname, 'src/components/common'),
        '~frame': path.resolve(__dirname, 'src/components/frame'),
        '~gql': path.resolve(__dirname, 'src/graphql'),
        '~constants': path.resolve(__dirname, 'src/constants'),
        '~context': path.resolve(__dirname, 'src/context'),
        '~hooks': path.resolve(__dirname, 'src/hooks'),
        '~images': path.resolve(__dirname, 'src/images'),
        //   '~data': path.resolve(__dirname, 'src/data'),
        '~redux': path.resolve(__dirname, 'src/redux'),
        '~routes': path.resolve(__dirname, 'src/routes'),
        '~utils': path.resolve(__dirname, 'src/utils'),
        '~styles': path.resolve(__dirname, 'src/styles/shared'),
        //   '~testutils': path.resolve(__dirname, 'src/__tests__/utils.ts'),
        '~types': path.resolve(__dirname, 'src/types'),
        //   '~dialogs': path.resolve(__dirname, 'src/modules/dashboard/components/Dialogs')
        '~cache': path.resolve(__dirname, 'src/cache'),
        '~transformers': path.resolve(__dirname, 'src/transformers'),
        assert: 'assert',
        buffer: 'buffer',
        crypto: 'crypto-browserify',
        http: 'stream-http',
        https: 'https-browserify',
        os: 'os-browserify/browser',
        process: 'process/browser',
        stream: 'stream-browserify',
        util: 'util',
      },
    ),
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    fallback: {
      fs: false,
      net: false,
      child_process: false,
      Buffer: false,
      process: false,
    },
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
          '@teamsupercell/typings-for-css-modules-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                exportLocalsConvention: 'camelCaseOnly',
                localIdentName: '[name]_[local]_[contenthash:base64:8]',
              },
              importLoaders: 1,
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
        include: [path.resolve('src')],
        type: 'asset/resource',
      },
      /*
       * To load svg icons and token icons to import
       */
      {
        test: /\.svg$/,
        exclude: [path.resolve(__dirname, 'src', 'images', 'icons')],
        use: '@svgr/webpack',
      },
      /*
       * We are only parsing images inside `src/client/images/icons`. Doing so allows us to bundle the commonly-used icons.
       * This loader also runs the images through a svg optimizer. See: https://github.com/svg/svgo#what-it-can-do
       * To use with Icon component
       */
      {
        test: /\.svg$/,
        include: [path.resolve(__dirname, 'src', 'images', 'icons')],
        use: [
          {
            loader: 'svg-sprite-loader',
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: svgoPlugins,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [path.resolve(__dirname, 'src', 'images', 'tokens')],
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
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/templates/index.html',
      favicon: 'src/images/favicon.png',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
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
  experiments: {
    asyncWebAssembly: true,
  },
};

module.exports = { config, svgoPlugins };
