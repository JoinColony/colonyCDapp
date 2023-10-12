import type { Meta, StoryObj } from '@storybook/react';

import PermissionsBadge from '~v5/common/Pills/PermissionsBadge';

const meta: Meta<typeof PermissionsBadge> = {
  title: 'Common/Pills/Permissions Badge',
  component: PermissionsBadge,
  argTypes: {
    text: {
      name: 'Text',
      control: {
        type: 'text',
      },
    },
    isMultiSig: {
      name: 'Is MultiSig',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PermissionsBadge>;

export const Base: Story = {
  args: {
    text: 'Payer',
  },
};

export const MultiSig: Story = {
  args: {
    text: 'Custom',
    isMultiSig: true,
  },
};
