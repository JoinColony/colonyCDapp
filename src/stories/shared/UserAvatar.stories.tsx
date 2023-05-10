import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserAvatar from '~shared/Extensions/UserAvatar';

const meta: Meta<typeof UserAvatar> = {
  title: 'Shared/User Avatar',
  component: UserAvatar,
  decorators: [
    (Story) => (
      <Router>
        <div className="text-gray-900">
          <Story />
        </div>
      </Router>
    ),
  ],
  parameters: {
    reactRouter: {
      routePath: '/user/:userId',
      routeParams: { userId: '1' },
    },
  },
  argTypes: {
    userName: {
      name: 'User name',
      control: {
        type: 'text',
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
    userName: 'Panda',
    isLink: false,
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Base: Story = {};
