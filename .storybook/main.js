const path = require('path');
const devWebpackConfig = require('../webpack.dev');

const devConfig = devWebpackConfig();

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
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
      ...devConfig.resolve.alias,
    };

    const fileLoaderRule = config.module.rules.find((rule) => !Array.isArray(rule.test) && rule.test.test('.svg'));
    fileLoaderRule.exclude = /\.svg$/;

    config.module.rules.push({
      test: /\.svg$/i,
      loader: require.resolve('svg-sprite-loader'),
    });

    config.module.rules = config.module.rules.filter(({ test }, index) => !test || (!test.test("test.css") && !test.test("test.scss") && !test.test("test.tsx")));
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
            '@teamsupercell/typings-for-css-modules-loader',
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
      ],
    });
    config.module.rules.push({
      test: /\.css$/,
      include: [
        path.resolve('node_modules', 'draft-js'),
        path.resolve('node_modules', 'rc-slider'),
        path.resolve('node_modules', 'react-responsive-carousel'),
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
            configFile: 'tsconfig.dev.json'
          },
        },
      ],
    });

    return config;
  },
};
