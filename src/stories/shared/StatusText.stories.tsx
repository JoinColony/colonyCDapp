import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import StatusText from '~v5/shared/StatusText';

const statusTextMeta: Meta<typeof StatusText> = {
  title: 'Shared/Status Text',
  component: StatusText,
  argTypes: {
    status: {
      name: 'Status',
      control: {
        type: 'select',
      },
      options: ['success', 'warning', 'error'],
    },
    withIcon: {
      name: 'With Icon',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    status: 'success',
    children:
      'The required permissions have been updated. You can now enable the extension.',
    withIcon: true,
  },
};

export default statusTextMeta;

export const Base: StoryObj<typeof StatusText> = {
  render: (args) => <StatusText {...args} />,
};
