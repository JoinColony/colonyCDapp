import type { Meta, StoryObj } from '@storybook/react';

import TextButton from '~v5/shared/Button/TextButton';

const meta: Meta<typeof TextButton> = {
  title: 'Shared/Buttons/Text Button',
  component: TextButton,
  argTypes: {
    mode: {
      name: 'Mode',
      table: {
        disable: true,
      },
    },
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
    text: 'View objective',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof TextButton>;

export const Base: Story = {};

export const Underlined: Story = {
  args: {
    mode: 'underlined',
  },
};
