import React from 'react';

import MemberSignature from '~v5/common/MemberSignature/index.ts';
import { Avatar2 } from '~v5/shared/Avatar/Avatar.tsx';

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
    children: (
      <Avatar2
        size={20}
        address="0xb77D57F4959eAfA0339424b83FcFaf9c15407461"
        alt="user avatar"
      />
    ),
  },
};
