import type { Meta, StoryObj } from '@storybook/react';

import UserAvatar from '~v5/shared/UserAvatar';

const meta: Meta<typeof UserAvatar> = {
  title: 'Shared/User Avatar',
  component: UserAvatar,
  parameters: {
    reactRouter: {
      routePath: '/user/:userId',
      routeParams: { userId: '1' },
    },
  },
  argTypes: {
    user: {
      name: 'User',
      control: {
        type: 'object',
      },
    },
    isLink: {
      name: 'Is link?',
      control: {
        type: 'boolean',
      },
    },
    size: {
      name: 'Size',
      options: ['xxs', 'xs'],
      control: {
        type: 'select',
      },
    },
  },
  args: {
    user: {
      profile: { displayName: 'Panda' },
      walletAddress: '0x0',
    },
    isLink: false,
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Base: Story = {};
