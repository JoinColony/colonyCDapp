import UserStatus from '~v5/common/Pills/UserStatus';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof UserStatus> = {
  title: 'Common/Pills/User Status',
  component: UserStatus,
  argTypes: {
    mode: {
      name: 'Mode',
      options: [
        'dedicated',
        'dedicated-filled',
        'active',
        'active-filled',
        'new',
        'active-new',
        'top',
        'top-filled',
        'banned',
        'team',
      ],
      control: {
        type: 'select',
      },
    },
    pillSize: {
      name: 'Size',
      options: ['medium', 'small'],
      control: {
        type: 'select',
      },
    },
    iconName: {
      name: 'Icon',
      options: [
        'medal-bold',
        'shooting-star-bold',
        'hand-heart',
        'crown-simple',
      ],
      control: {
        type: 'select',
      },
    },
    text: {
      name: 'Text',
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserStatus>;

export const Dedicated: Story = {
  args: {
    mode: 'dedicated',
    iconName: 'medal-bold',
    text: 'Dedicated',
    pillSize: 'medium',
  },
};

export const DedicatedFilled: Story = {
  args: {
    mode: 'dedicated-filled',
    iconName: 'medal-bold',
    text: 'Dedicated',
    pillSize: 'medium',
  },
};

export const Active: Story = {
  args: {
    mode: 'active',
    iconName: 'shooting-star-bold',
    text: 'Active',
    pillSize: 'medium',
  },
};

export const ActiveFilled: Story = {
  args: {
    mode: 'active-filled',
    iconName: 'shooting-star-bold',
    text: 'Active',
    pillSize: 'medium',
  },
};

export const New: Story = {
  args: {
    mode: 'new',
    iconName: 'hand-heart',
    text: 'New',
    pillSize: 'medium',
  },
};

export const ActiveNew: Story = {
  args: {
    mode: 'active-new',
    iconName: 'hand-heart',
    text: 'Active',
    pillSize: 'medium',
  },
};

export const Top: Story = {
  args: {
    mode: 'top',
    iconName: 'crown-simple',
    text: 'Top',
    pillSize: 'medium',
  },
};

export const TopFilled: Story = {
  args: {
    mode: 'top-filled',
    iconName: 'crown-simple',
    text: 'Top',
    pillSize: 'medium',
  },
};

export const Banned: Story = {
  args: {
    mode: 'banned',
    text: 'Banned',
    pillSize: 'medium',
  },
};

export const Team: Story = {
  args: {
    mode: 'team',
    text: 'Team',
    pillSize: 'medium',
  },
};

export const DedicatedCrown: Story = {
  args: {
    mode: 'top',
    iconName: 'crown-simple',
    text: 'Dedicated',
    pillSize: 'medium',
  },
};
