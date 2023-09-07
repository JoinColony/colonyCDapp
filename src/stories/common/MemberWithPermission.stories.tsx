import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import MemberWithPermission from '~v5/common/MemberWithPermission';

const meta: Meta<typeof MemberWithPermission> = {
  title: 'Common/Member With Permission',
  component: MemberWithPermission,
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
    isSigned: {
      name: 'Is Signed',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MemberWithPermission>;

export const Base: Story = {
  args: {
    isSigned: true,
  },
};
