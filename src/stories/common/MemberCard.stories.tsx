import MemberCard from '~v5/common/MemberCard';

import type { Meta, StoryObj } from '@storybook/react';

const memberCardMeta: Meta<typeof MemberCard> = {
  title: 'Common/Member Card',
  component: MemberCard,
  args: {
    userAvatarProps: {
      aboutDescription: 'test',
      userName: 'test',
      isVerified: true,
      walletAddress: '',
    },
    meatBallMenuProps: {
      items: [
        {
          key: '1',
          label: 'test',
          onClick: () => {},
        },
      ],
    },
  },
};

export default memberCardMeta;

export const Base: StoryObj<typeof MemberCard> = {};

export const WithBadge: StoryObj<typeof MemberCard> = {
  args: {
    userAvatarProps: {
      aboutDescription: 'test',
      userName: 'test',
      mode: 'active',
      walletAddress: '',
    },
    role: {
      name: 'admin',
      role: 'admin',
      permissions: [],
    },
  },
};

export const WithReputation: StoryObj<typeof MemberCard> = {
  args: {
    reputation: 59,
  },
};

export const WithReputationAndBadge: StoryObj<typeof MemberCard> = {
  args: {
    reputation: 59,
    role: {
      name: 'admin',
      role: 'admin',
      permissions: [],
    },
  },
};

export const Simple: StoryObj<typeof MemberCard> = {
  args: {
    isSimple: true,
  },
};
