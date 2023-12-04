import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Icon from '~shared/Icon';

import TxButton from '~v5/shared/Button/TxButton';

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
      <span className="flex shrink-0 ml-1.5">
        <Icon
          name="spinner-gap"
          className="animate-spin"
          appearance={{ size: 'tiny' }}
        />
      </span>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof TxButton>;

export const Base: Story = {};
