import type { Meta, StoryObj } from '@storybook/react';

import PageTitle from '~v5/common/PageTitle';

const meta: Meta<typeof PageTitle> = {
  title: 'Common/Page Title',
  component: PageTitle,
  argTypes: {
    title: {
      name: 'Title',
      control: {
        type: 'text',
      },
    },
    subtitle: {
      name: 'Subtitle',
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageTitle>;

export const Base: Story = {
  args: {
    title:
      'Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
    subtitle: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
  },
};
