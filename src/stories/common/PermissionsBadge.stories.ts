import PermissionsBadge from '~v5/common/Pills/PermissionsBadge';

import type { Meta, StoryObj } from '@storybook/react';

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
    iconName: {
      name: 'Icon Name',
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PermissionsBadge>;

export const Base: Story = {
  args: {
    text: 'Payer',
    iconName: 'user',
  },
};

export const MultiSig: Story = {
  args: {
    text: 'Custom',
    iconName: 'user-three',
  },
};
