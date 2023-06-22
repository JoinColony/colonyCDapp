import type { Meta, StoryObj } from '@storybook/react';

import UserBadges from '~v5/shared/UserBadges';

const meta: Meta<typeof UserBadges> = {
  title: 'Shared/User Badges',
  component: UserBadges,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      name: 'Size',
      control: {
        type: 'select',
      },
      options: ['small', 'medium'],
    },
    type: {
      name: 'Type',
      control: {
        type: 'select',
      },
      options: ['dedicated', 'active', 'new', 'top', 'banned', 'team'],
    },
    isStatus: {
      name: 'Is badge status?',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserBadges>;

export const Base: Story = {
  args: {
    size: 'small',
    type: 'dedicated',
    isStatus: false,
  },
};
