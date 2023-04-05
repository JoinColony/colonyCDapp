import type { Meta, StoryObj } from '@storybook/react';
import FormError from '~shared/Extensions/FormError/FormError';

const meta: Meta<typeof FormError> = {
  title: 'Shared/Form Error',
  component: FormError,
  argTypes: {
    aligment: {
      name: 'aligment',
      options: ['right', 'left', 'center'],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormError>;

export const Base: Story = {
  args: {
    aligment: 'right',
    children: 'Hours must be less than 8766',
  },
};
