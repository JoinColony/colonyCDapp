import { List } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';

import Hamburger from '~v5/shared/Button/Hamburger.tsx';

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
    icon: {
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
    icon: List,
    isOpened: false,
  },
};

export default meta;
type Story = StoryObj<typeof Hamburger>;

export const Base: Story = {};
