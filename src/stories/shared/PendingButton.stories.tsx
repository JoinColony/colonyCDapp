import type { Meta, StoryObj } from '@storybook/react';

import PendingButton from '~v5/shared/Button/PendingButton';

const meta: Meta<typeof PendingButton> = {
  title: 'Shared/Buttons/Pending Button',
  component: PendingButton,
  argTypes: {
    text: {
      name: 'Text',
      control: {
        type: 'text',
      },
    },
    disabled: {
      name: 'Disabled',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    text: 'Pending...',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof PendingButton>;

export const Base: Story = {};
