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
          userName: 'CaptainPlanet',
          isVerified: true,
          mode: 'top-filled',
          walletAddress: '',
          user: {
            profile: {
              bio: 'CaptainPlanet',
            },
            walletAddress: '',
          },
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
          userName: 'panda',
          mode: 'dedicated-filled',
          isVerified: true,
          walletAddress: '',
          user: {
            profile: {
              bio: 'panda',
            },
            walletAddress: '',
          },
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
          userName: 'shredder',
          mode: 'active-filled',
          walletAddress: '',
          user: {
            profile: {
              bio: 'shredder',
            },
            walletAddress: '',
          },
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
          userName: 'RodgerRamjet',
          isVerified: true,
          walletAddress: '',
          user: {
            profile: {
              bio: 'RodgerRamjet',
            },
            walletAddress: '',
          },
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
          userName: 'rocko',
          isVerified: true,
          walletAddress: '',
          user: {
            profile: {
              bio: 'rocko',
            },
            walletAddress: '',
          },
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
          userName: 'ChuckieFinster',
          isVerified: true,
          walletAddress: '',
          user: {
            profile: {
              bio: 'ChuckieFinster',
            },
            walletAddress: '',
          },
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
          userName: 'heyarnold',
          isVerified: true,
          walletAddress: '',
          user: {
            profile: {
              bio: 'heyarnold',
            },
            walletAddress: '',
          },
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
