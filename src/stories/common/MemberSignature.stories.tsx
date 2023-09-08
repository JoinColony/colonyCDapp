import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import MemberSignature from '~v5/common/MemberSignature';

const memberSignatureMeta: Meta<typeof MemberSignature> = {
  title: 'Common/Member Signature',
  component: MemberSignature,
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
    isChecked: {
      name: 'Is Signed',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default memberSignatureMeta;

export const Base: StoryObj<typeof MemberSignature> = {
  args: {
    isChecked: true,
    avatarProps: {
      userName: 'John Doe',
      walletAddress: '0x1234567890abcdef',
    },
  },
};
