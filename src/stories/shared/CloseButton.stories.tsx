import CloseButton from '~v5/shared/Button/CloseButton.tsx';

import type { Meta, StoryObj } from '@storybook/react';

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
  },
  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof CloseButton>;

export const Base: Story = {};
