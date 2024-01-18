import TeamCard from '~v5/common/TeamCard';

import type { Meta, StoryObj } from '@storybook/react';

const teamCardMeta: Meta<typeof TeamCard> = {
  title: 'Common/Team Card',
  component: TeamCard,
  args: {
    title: 'Design',
    teamProps: {
      name: 'Design',
      color: 'AQUA',
    },
    meatBallMenuProps: {
      items: [
        {
          key: '1',
          label: 'Item 1',
        },
        {
          key: '2',
          label: 'Item 2',
        },
      ],
    },
    reputation: 12,
    balance: '$56,114 USD',
    members: [
      {
        walletAddress: '0x0',
      },
      {
        walletAddress: '0x1',
      },
      {
        walletAddress: '0x2',
      },
      {
        walletAddress: '0x3',
      },
      {
        walletAddress: '0x4',
      },
      {
        walletAddress: '0x5',
      },
      {
        walletAddress: '0x6',
      },
    ],
    description:
      "The product design team's main objective is to conceive, prototype, and refine innovative product concepts that align with user needs, business goals, & market trends, ensuring a seamless and great user experiences.",
  },
};

export default teamCardMeta;

export const Base: StoryObj<typeof TeamCard> = {};

export const WithLinks: StoryObj<typeof TeamCard> = {
  args: {
    links: [
      {
        key: '1',
        to: '/',
        text: 'Agreements',
      },
      {
        key: '2',
        to: '/',
        text: 'Activity',
      },
    ],
  },
};
