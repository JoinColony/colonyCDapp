import { User, UsersThree } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';

import PermissionsBadge from '~v5/common/Pills/PermissionsBadge/index.ts';

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
    icon: {
      name: 'Icon',
      control: {
        type: 'object',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PermissionsBadge>;

export const Base: Story = {
  args: {
    text: 'Payer',
    icon: User,
  },
};

export const MultiSig: Story = {
  args: {
    text: 'Custom',
    icon: UsersThree,
  },
};
