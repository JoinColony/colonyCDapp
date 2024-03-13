import { SpinnerGap } from '@phosphor-icons/react';
import React from 'react';

import TxButton from '~v5/shared/Button/TxButton.tsx';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TxButton> = {
  title: 'Shared/Buttons/Tx Button',
  component: TxButton,
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
type Story = StoryObj<typeof TxButton>;

export const Base: Story = {};
