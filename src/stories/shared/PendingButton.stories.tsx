import { SpinnerGap } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import IconButton from '~v5/shared/Button/IconButton.tsx';

const meta: Meta<typeof IconButton> = {
  title: 'Shared/Buttons/Tx Button',
  component: IconButton,
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
    icon: (
      <span className="ml-1.5 flex shrink-0">
        <SpinnerGap className="animate-spin" size={14} />
      </span>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Base: Story = {};
