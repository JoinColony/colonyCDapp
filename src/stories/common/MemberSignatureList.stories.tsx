import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import MemberSignatureList from '~v5/common/MemberSignatureList';

const memberSignatureMeta: Meta<typeof MemberSignatureList> = {
  title: 'Common/Member Signature List',
  component: MemberSignatureList,
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
    isLoading: {
      name: 'Is Loading',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default memberSignatureMeta;

export const Base: StoryObj<typeof MemberSignatureList> = {
  args: {
    isLoading: false,
    title: <FormattedMessage id="common.memberSignatureList.title" />,
    items: [
      {
        name: 'John Doe',
        walletAddress: '0x1234567890123456789012345678901234567890',
      },
      {
        name: 'Andrew Doe',
        walletAddress: '0x12345678901234567890',
      },
      {
        name: 'Thomas Doe',
        walletAddress: '0x1234567890',
      },
    ],
    checkedUsersList: ['0x1234567890123456789012345678901234567890'],
  },
};
