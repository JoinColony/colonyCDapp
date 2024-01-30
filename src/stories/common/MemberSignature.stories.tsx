import React from 'react';

import MemberSignature from '~v5/common/MemberSignature/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

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
    hasSigned: {
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
    hasSigned: true,
    avatarProps: {
      userName: 'John Doe',
      seed: '0x1234567890abcdef',
    },
  },
};
