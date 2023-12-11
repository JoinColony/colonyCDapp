import type { Meta, StoryObj } from '@storybook/react';

import MemberCard from '~v5/common/MemberCard';

const memberCardMeta: Meta<typeof MemberCard> = {
  title: 'Common/Member Card',
  component: MemberCard,
  args: {
    userAvatarProps: {
      userName: 'test',
      isVerified: true,
      walletAddress: '',
      user: {
        profile: {
          bio: 'test',
        },
        walletAddress: '',
      },
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
      userName: 'test',
      mode: 'active',
      walletAddress: '',
      user: {
        profile: {
          bio: 'test',
        },
        walletAddress: '',
      },
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
