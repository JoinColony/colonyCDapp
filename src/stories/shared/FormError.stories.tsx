import type { Meta, StoryObj } from '@storybook/react';
import FormError from '~shared/Extensions/FormError/FormError';

const meta: Meta<typeof FormError> = {
  title: 'Shared/Form Error',
  component: FormError,
  argTypes: {
    alignment: {
      name: 'alignment',
      options: ['right', 'left', 'center'],
      control: {
        type: 'select',
      },
    },
    isFullSize: {
      name: 'Is full size?',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    isFullSize: false,
  },
};

export default meta;
type Story = StoryObj<typeof FormError>;

export const Base: Story = {
  args: {
    alignment: 'right',
    children: 'Hours must be less than 8766',
  },
};
