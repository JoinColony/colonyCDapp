import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Card from '~shared/Extensions/Card';

const meta: Meta<typeof Card> = {
  title: 'Shared/Card',
  component: Card,
  argTypes: {
    rounded: {
      name: 'Rounded',
      options: ['s', 'm'],
      control: {
        type: 'select',
      },
    },
    hasShadow: {
      name: 'With shadow?',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    hasShadow: false,
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Base: Story = {
  render: (args) => (
    <Card {...args}>
      The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox
      jumps over the lazy dog.
    </Card>
  ),
};
