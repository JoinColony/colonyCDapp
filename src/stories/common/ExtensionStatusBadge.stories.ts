import type { Meta, StoryObj } from '@storybook/react';
import ExtensionsStatusBadge from '~common/Extensions/ExtensionStatusBadge-new';

const meta: Meta<typeof ExtensionsStatusBadge> = {
  title: 'Common/Extension Status Badge',
  component: ExtensionsStatusBadge,
  argTypes: {
    mode: {
      name: 'Mode',
      options: ['Coming soon', 'Not installed', 'Enabled', 'Disabled', 'Deprecated', 'Governance', 'New'],
      control: {
        type: 'select',
      },
    },
    text: {
      name: 'Text',
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ExtensionsStatusBadge>;

export const Base: Story = {
  args: {
    mode: 'Coming soon',
    text: 'Coming soon',
  },
};
