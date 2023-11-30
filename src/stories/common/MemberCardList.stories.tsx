import type { Meta, StoryObj } from '@storybook/react';

import MemberCardList from '~v5/common/MemberCardList';

const memberCardListMeta: Meta<typeof MemberCardList> = {
  title: 'Common/Member Card List',
  component: MemberCardList,
  args: {
    items: [
      {
        key: '1',
        userAvatarProps: {
          aboutDescription: 'CaptainPlanet',
          userName: 'CaptainPlanet',
          isVerified: true,
          mode: 'top-filled',
          walletAddress: '',
        },
        reputation: 42,
        role: {
          name: 'admin',
          role: 'admin',
          permissions: [],
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
      {
        key: '2',
        userAvatarProps: {
          aboutDescription: 'panda',
          userName: 'panda',
          mode: 'dedicated-filled',
          isVerified: true,
          walletAddress: '',
        },
        reputation: 37,
        role: {
          name: 'admin',
          role: 'admin',
          permissions: [],
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
      {
        key: '3',
        userAvatarProps: {
          aboutDescription: 'shredder',
          userName: 'shredder',
          mode: 'active-filled',
          walletAddress: '',
        },
        reputation: 22,
        role: {
          name: 'admin',
          role: 'admin',
          permissions: [],
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
      {
        key: '4',
        userAvatarProps: {
          aboutDescription: 'RodgerRamjet',
          userName: 'RodgerRamjet',
          isVerified: true,
          walletAddress: '',
        },
        reputation: 13,
        role: {
          name: 'payer',
          role: 'payer',
          permissions: [],
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
      {
        key: '5',
        userAvatarProps: {
          aboutDescription: 'rocko',
          userName: 'rocko',
          isVerified: true,
          walletAddress: '',
        },
        reputation: 9,
        role: {
          name: 'payer',
          role: 'payer',
          permissions: [],
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
      {
        key: '6',
        userAvatarProps: {
          aboutDescription: 'ChuckieFinster',
          userName: 'ChuckieFinster',
          isVerified: true,
          walletAddress: '',
        },
        reputation: 6,
        role: {
          name: 'payer',
          role: 'payer',
          permissions: [],
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
      {
        key: '7',
        userAvatarProps: {
          aboutDescription: 'heyarnold',
          userName: 'heyarnold',
          isVerified: true,
          walletAddress: '',
        },
        reputation: 5,
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
    ],
  },
};

export default memberCardListMeta;

export const Base: StoryObj<typeof MemberCardList> = {};

export const Simple: StoryObj<typeof MemberCardList> = {
  args: {
    isSimple: true,
  },
};
