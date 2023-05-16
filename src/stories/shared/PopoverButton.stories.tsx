import type { Meta, StoryObj } from '@storybook/react';
import PopoverButton from '~shared/Extensions/PopoverButton';

const meta: Meta<typeof PopoverButton> = {
  title: 'Shared/Popover Button',
  component: PopoverButton,
  argTypes: {
    type: {
      name: 'Mode',
      options: ['deposit', 'withdraw', 'view'],
      control: {
        type: 'select',
      },
    },
    isDisabled: {
      name: 'Disabled',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    type: 'deposit',
    isDisabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof PopoverButton>;

export const Primary: Story = {
  args: {
    type: 'deposit',
  },
};
