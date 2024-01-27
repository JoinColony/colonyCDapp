import TeamCardList from '~v5/common/TeamCardList/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const members = [
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
];

const teamCardListMeta: Meta<typeof TeamCardList> = {
  title: 'Common/Team Card List',
  component: TeamCardList,
  args: {
    items: [
      {
        key: '1',
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
        members: members.slice(0, 4),
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
        description:
          "The product design team's main objective is to conceive, prototype, and refine innovative product concepts that align with user needs, business goals, & market trends, ensuring a seamless and great user experiences.",
      },
      {
        key: '2',
        title: 'Product',
        teamProps: {
          name: 'Product',
          color: 'BLUE',
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
        reputation: 11,
        balance: '$27,110 USD',
        members,
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
        description:
          "The product team's main goal is to develop, manage, and optimize the company's product portfolio, ensuring the delivery of high-quality products that meet customer needs, drive revenue growth.",
      },
      {
        key: '3',
        title: 'Development',
        teamProps: {
          name: 'Development',
          color: 'BLUE_GREY',
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
        reputation: 10,
        balance: '$199,203 USD',
        members,
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
        description:
          "The development team's main goal is to design, code, and implement software solutions that meet the needs of the organization and its customers.",
      },
      {
        key: '4',
        title: 'Network',
        teamProps: {
          name: 'Network',
          color: 'EMERALD_GREEN',
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
        reputation: 10,
        balance: '$199,203 USD',
        members,
        description:
          "The network team's primary purpose is to design, implement, and maintain a secure and efficient network infrastructure that supports seamless communication, data transfer, and connectivity.",
      },
      {
        key: '5',
        title: 'Business ',
        teamProps: {
          name: 'Business ',
          color: 'GOLD',
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
        reputation: 10,
        balance: '$199,203 USD',
        members,
      },
      {
        key: '6',
        title: 'Operations ',
        teamProps: {
          name: 'Operations ',
          color: 'GREEN',
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
        reputation: 10,
        balance: '$199,203 USD',
      },
    ],
  },
};

export default teamCardListMeta;

export const Base: StoryObj<typeof TeamCardList> = {};
