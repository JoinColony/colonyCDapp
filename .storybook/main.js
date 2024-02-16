const path = require('path');
const webpack = require('webpack');
const devWebpackConfig = require('../webpack.dev');

const devConfig = devWebpackConfig();

const svgoPlugins = [
  { removeTitle: true },
  { convertColors: { shorthex: false } },
  { convertPathData: false },
];

module.exports = {
  core: {
    builder: 'webpack5',
  },
  typescript: { reactDocgen: false },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-apollo-client',
    'storybook-react-intl',
    {
      name: '@storybook/addon-styling',
      options: {
        // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
        // For more details on this addon's options.
        postCss: true,
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~hooks': path.resolve(__dirname, '../src/hooks'),
      '~images': path.resolve(__dirname, '../src/images'),
      '~types': path.resolve(__dirname, '../src/types'),
      '~utils': path.resolve(__dirname, '../src/utils'),
      '~gql': path.resolve(__dirname, '../src/graphql'),
      '~constants': path.resolve(__dirname, '../src/constants'),
      '~shared': path.resolve(__dirname, '../src/components/shared'),
      '~v5': path.resolve(__dirname, '../src/components/v5'),
      '~common': path.resolve(__dirname, '../src/components/common'),
      '~frame': path.resolve(__dirname, '../src/components/frame'),
      '~images/*': path.resolve(__dirname, '../src/images'),
      '~components': path.resolve(__dirname, '../src/components'),
      ...devConfig.resolve.alias,
    };

    config.module.rules = config.module.rules.filter(
      ({ test }) =>
        !test ||
        (!test.test('test.css') &&
          !test.test('test.scss') &&
          !test.test('test.svg') &&
          !test.test('test.tsx')),
    );

    config.module.rules.push({
      test: /\.(woff|woff2|png|jpe?g|gif)$/,
      include: [path.resolve(__dirname, '..', 'src')],
      type: 'asset/resource',
    });

    /*
     * To load svg icons and token icons to import
     */
    config.module.rules.push({
      test: /\.svg$/,
      exclude: [path.resolve(__dirname, '..', 'src', 'images', 'icons')],
      use: '@svgr/webpack',
    });

    /*
     * We are only parsing images inside `src/client/images/icons`. Doing so allows us to bundle the commonly-used icons.
     * This loader also runs the images through a svg optimizer. See: https://github.com/svg/svgo#what-it-can-do
     * To use with Icon component
     */
    config.module.rules.push({
      test: /\.svg$/,
      include: [path.resolve(__dirname, '..', 'src', 'images', 'icons')],
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
    });

    config.module.rules.push({
      test: /\.svg$/,
      include: [path.resolve(__dirname, '..', 'src', 'images', 'tokens')],
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
    });

    config.module.rules.push({
      test: /\.css$/,
      oneOf: [
        {
          test: /\.global\.css$/,
          include: [
            path.resolve(__dirname, '..', 'src', 'components'),
            path.resolve(__dirname, '..', 'src', 'styles'),
          ],
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, '..', 'src', 'components'),
            path.resolve(__dirname, '..', 'src', 'styles'),
          ],
          use: [
            'style-loader',
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
      ],
    });
    config.module.rules.push({
      test: /\.css$/,
      include: [
        path.resolve('node_modules', 'rc-slider'),
        path.resolve('node_modules', 'react-datepicker'),
      ],
      use: ['style-loader', 'css-loader'],
    });

    config.module.rules.push({
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
    });

    const providePlugin = config.plugins.find(
      (plugin) => plugin.constructor === webpack.ProvidePlugin,
    );

    if (providePlugin) {
      providePlugin.definitions = {
        ...providePlugin.definitions,
        Buffer: ['buffer', 'Buffer'],
      };
    } else {
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      );
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        SAFE_ENABLED_LOCALLY: JSON.stringify(process.env.SAFE === 'enabled'),
      }),
    );

    return config;
  },
};
