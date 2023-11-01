import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

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
    title: 'Members with recovery permissions',
    items: [
      {
        avatarProps: {
          userName: 'John Doe',
          seed: '0x1234567890123456789012345678901234567890',
        },
        hasSigned: true,
        key: '1',
      },
      {
        avatarProps: {
          userName: 'Andrew Doe',
          seed: '0x12345678901234567890',
        },
        hasSigned: false,
        key: '2',
      },
      {
        avatarProps: {
          userName: 'Thomas Doe',
          seed: '0x1234567890',
        },
        hasSigned: false,
        key: '3',
      },
    ],
  },
};

export const ListLoading: StoryObj<typeof MemberSignatureList> = {
  args: {
    isLoading: true,
    title: 'Members with recovery permissions',
    items: [
      {
        avatarProps: {
          userName: 'John Doe',
          seed: '0x1234567890123456789012345678901234567890',
        },
        hasSigned: true,
        key: '1',
      },
      {
        avatarProps: {
          userName: 'Andrew Doe',
          seed: '0x12345678901234567890',
        },
        hasSigned: false,
        key: '2',
      },
      {
        avatarProps: {
          userName: 'Thomas Doe',
          seed: '0x1234567890',
        },
        hasSigned: false,
        key: '3',
      },
    ],
  },
};

export const EmptyList: StoryObj<typeof MemberSignatureList> = {
  args: {
    isLoading: false,
    title: 'Members with recovery permissions',
    items: [],
  },
};
