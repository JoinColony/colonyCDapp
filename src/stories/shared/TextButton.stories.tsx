import TextButton from '~v5/shared/Button/TextButton.tsx';

import type { Meta, StoryObj } from '@storybook/react';

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
};

export default meta;
type Story = StoryObj<typeof TextButton>;

export const Base: Story = {};

export const Underlined: Story = {
  args: {
    mode: 'underlined',
  },
};
