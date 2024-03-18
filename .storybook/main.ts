import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  typescript: { reactDocgen: false },
  stories: [
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/integrations/stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-apollo-client',
    'storybook-react-intl',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
