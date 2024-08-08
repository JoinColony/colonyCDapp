import { Buildings } from '@phosphor-icons/react';
import { type Meta, type StoryObj } from '@storybook/react';

import UserPermissionsBadge from '~common/Extensions/UserPermissionsBadge/index.ts';

const meta: Meta<typeof UserPermissionsBadge> = {
  title: 'Common/User Permissions Badge',
  component: UserPermissionsBadge,
  parameters: {
    layout: 'centered',
  },
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
    description: {
      name: 'Description',
      control: {
        type: 'text',
      },
    },
    placement: {
      name: 'Placement',
      options: [
        'auto',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'left',
      ],
      control: {
        type: 'select',
      },
    },
  },
  args: {
    placement: 'auto',
  },
};

export default meta;
type Story = StoryObj<typeof UserPermissionsBadge>;

export const Base: Story = {
  args: {
    text: 'Architecture',
    icon: Buildings,
    description:
      'This permission allows users to create new domains, and manage permissions within those domains.',
  },
};
