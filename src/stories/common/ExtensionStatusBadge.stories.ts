import type { Meta, StoryObj } from '@storybook/react';

import ExtensionsStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';

const meta: Meta<typeof ExtensionsStatusBadge> = {
  title: 'Common/Pills/Extension Status Badge',
  component: ExtensionsStatusBadge,
  argTypes: {
    mode: {
      name: 'Mode',
      options: [
        'coming-soon',
        'not-installed',
        'enabled',
        'disabled',
        'deprecated',
        'extension',
        'governance',
        'new',
      ],
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
    mode: 'coming-soon',
    text: 'Coming soon',
  },
};
