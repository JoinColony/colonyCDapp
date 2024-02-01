import { MotionVote } from '~utils/colonyMotions.ts';
import UserInfoSectionList from '~v5/shared/UserInfoSectionList/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const userInfoSectionListMeta: Meta<typeof UserInfoSectionList> = {
  title: 'Shared/User Info Section List',
  component: UserInfoSectionList,
  args: {
    sections: [
      {
        key: '1',
        heading: {
          vote: MotionVote.Yay,
        },
        items: [
          {
            key: '1',
            info: 'Staked 5.67 CLNY',
            user: {
              profile: { displayName: 'JohnnyBravo' },
              walletAddress: '0x0',
            },
          },
          {
            key: '2',
            info: 'Staked 4.95 CLNY',
            user: {
              profile: { displayName: 'ChuckieChukie' },
              walletAddress: '0x1',
            },
          },
          {
            key: '3',
            info: 'Staked 1.23 CLNY',
            user: {
              profile: { displayName: 'Reallylongusername' },
              walletAddress: '0x2',
            },
          },
        ],
      },
      {
        key: '2',
        heading: {
          vote: MotionVote.Nay,
        },
        items: [
          {
            key: '1',
            info: 'Staked 5.67 CLNY',
            user: {
              profile: { displayName: 'JohnnyBravo' },
              walletAddress: '0x0',
            },
          },
          {
            key: '2',
            info: 'Staked 4.95 CLNY',
            user: {
              profile: { displayName: 'ChuckieChukie' },
              walletAddress: '0x1',
            },
          },
          {
            key: '3',
            info: 'Staked 1.23 CLNY',
            user: {
              profile: { displayName: 'Reallylongusername' },
              walletAddress: '0x2',
            },
          },
        ],
      },
    ],
  },
};

export default userInfoSectionListMeta;

export const Base: StoryObj<typeof UserInfoSectionList> = {};
