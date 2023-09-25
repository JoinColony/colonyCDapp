import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import TokenStatus from '~v5/common/ActionSidebar/partials/TokenSelect/partials/TokenStatus';

const tokenStatusMeta: Meta<typeof TokenStatus> = {
  title: 'Common/Token Status',
  component: TokenStatus,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-[17.125rem]">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    status: {
      name: 'Status',
      control: {
        type: 'select',
        options: ['success', 'error'],
      },
    },
  },
};

export default tokenStatusMeta;

export const Base: StoryObj<typeof TokenStatus> = {
  args: {
    status: 'success',
    children: 'XDAI',
  },
};

export const Error: StoryObj<typeof TokenStatus> = {
  args: {
    status: 'error',
    children: 'Something went wrong',
  },
};
