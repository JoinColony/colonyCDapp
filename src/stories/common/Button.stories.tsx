import type { Meta, StoryObj } from '@storybook/react';
import Button from '~shared/Extensions/Button';

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  argTypes: {
    mode: {
      name: 'Mode',
      options: ['primarySolid', 'primaryOutline', 'textButton'],
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
    disabled: {
      name: 'Disabled',
      control: {
        type: 'boolean',
      },
    },
  },
  args: { text: 'New action', disabled: false },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimarySolid: Story = {
  args: {
    mode: 'primarySolid',
  },
};

export const PrimaryOutline: Story = {
  args: {
    mode: 'primaryOutline',
  },
};

export const TextButton: Story = {
  args: {
    mode: 'textButton',
  },
};
