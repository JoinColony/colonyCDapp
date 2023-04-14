const path = require('path');

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
      '~types': path.resolve(__dirname, '../src/types'),
      '~utils': path.resolve(__dirname, '../src/utils'),
      '~gql': path.resolve(__dirname, '../src/graphql'),
      '~constants': path.resolve(__dirname, '../src/constants'),
      '~shared': path.resolve(__dirname, '../src/components/shared'),
      '~common': path.resolve(__dirname, '../src/components/common'),
      '~frame': path.resolve(__dirname, '../src/components/frame'),
    };
    return config;
  },
};
