import type { Meta, StoryObj } from '@storybook/react';
import UserPermissionsBadge from '~common/Extensions/UserPermissionsBadge';

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
    name: {
      name: 'Icon Name',
      options: ['app-window', 'bank', 'buildings', 'disabled', 'clipboard-text', 'clock-counter-clockwise', 'scales'],
      control: {
        type: 'select',
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
      options: ['auto', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'left'],
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
    name: 'buildings',
    description: 'This permission allows users to create new domains, and manage permissions within those domains.',
  },
};
