import type { Meta, StoryObj } from '@storybook/react';

import PillsBase from '~v5/common/Pills/PillsBase';

const meta: Meta<typeof PillsBase> = {
  title: 'Common/Pills Base',
  component: PillsBase,
  argTypes: {
    mode: {
      name: 'Mode',
      options: [
        'dedicated',
        'dedicatedFilled',
        'active',
        'activeFilled',
        'new',
        'activeNew',
        'top',
        'topFilled',
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
type Story = StoryObj<typeof PillsBase>;

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
    mode: 'dedicatedFilled',
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
    mode: 'activeFilled',
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
    mode: 'activeNew',
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
    mode: 'topFilled',
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
