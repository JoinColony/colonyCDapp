import { UserRole } from '~constants/permissions.ts';
import { ContributorType } from '~gql';
import MemberCard from '~v5/common/MemberCard/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const memberCardMeta: Meta<typeof MemberCard> = {
  title: 'Common/Member Card',
  component: MemberCard,
  args: {
    isVerified: true,
    user: {
      profile: {
        bio: 'test',
        displayName: 'test',
      },
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
    user: {
      profile: {
        bio: 'test',
        displayName: 'test',
      },
      walletAddress: '',
    },
    contributorType: ContributorType.Active,
    userAddress: '',
    role: {
      name: 'admin',
      role: UserRole.Admin,
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
      role: UserRole.Admin,
      permissions: [],
    },
  },
};
