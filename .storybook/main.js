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
      '~utils/lodash': path.resolve(__dirname, '../src/utils/lodash'),
      '~utils/isUrlExternal': path.resolve(__dirname, '../src/utils/isUrlExternal'),
      '~utils/isUrlExternal': path.resolve(__dirname, '../src/utils/isUrlExternal'),
      '~gql': path.resolve(__dirname, '../src/graphql'),
      '~shared/Link': path.resolve(__dirname, '../src/components/shared/Link'),
      '~constants': path.resolve(__dirname, '../src/constants'),
      '~common/Extensions': path.resolve(__dirname, '../src/components/common/Extensions'),
    };
    return config;
  },
};
