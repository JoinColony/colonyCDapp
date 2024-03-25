import UserAvatar from '~v5/shared/UserAvatar/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

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
    userName: {
      name: 'Username',
      control: {
        type: 'text',
      },
    },
    userAddress: {
      name: 'Username',
      control: {
        type: 'text',
      },
    },
    userAvatarSrc: {
      name: 'Username',
      control: {
        type: 'text',
      },
    },
    size: {
      name: 'Size',
      control: {
        type: 'number',
      },
    },
  },
  args: {
    userName: 'Panda',
    userAddress: '0x0',
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Base: Story = {};
