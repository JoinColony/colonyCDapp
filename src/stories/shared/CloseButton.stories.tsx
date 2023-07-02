import type { Meta, StoryObj } from '@storybook/react';

import CloseButton from '~v5/shared/Button/CloseButton';

const meta: Meta<typeof CloseButton> = {
  title: 'Shared/Buttons/Close Button',
  component: CloseButton,
  argTypes: {
    disabled: {
      name: 'Disabled',
      control: {
        type: 'boolean',
      },
    },
    iconSize: {
      name: 'Icon',
      options: ['extraTiny', 'tiny'],
      control: {
        type: 'select',
      },
    },
  },
  args: {
    disabled: false,
    iconSize: 'tiny',
  },
};

export default meta;
type Story = StoryObj<typeof CloseButton>;

export const Base: Story = {};
