import Hamburger from '~v5/shared/Button/Hamburger.tsx';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Hamburger> = {
  title: 'Shared/Buttons/Hamburger',
  component: Hamburger,
  argTypes: {
    disabled: {
      name: 'Disabled',
      control: {
        type: 'boolean',
      },
    },
    iconName: {
      name: 'Icon',
      options: ['list', 'close'],
      control: {
        type: 'select',
      },
    },
    isOpened: {
      name: 'Is Opened?',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    disabled: false,
    iconName: 'list',
    isOpened: false,
  },
};

export default meta;
type Story = StoryObj<typeof Hamburger>;

export const Base: Story = {};
