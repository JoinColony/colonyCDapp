import type { Meta, StoryObj } from '@storybook/react';
import UserInfoList from '~v5/shared/UserInfoSectionList/partials/UserInfoList';

const userInfoListMeta: Meta<typeof UserInfoList> = {
  title: 'Shared/User Info Section List/Partials/User Info List',
  component: UserInfoList,
  args: {
    items: [
      {
        key: '1',
        info: 'Staked 5.67 CLNY',
        userProps: {
          user: {
            profile: { displayName: 'JohnnyBravo' },
            walletAddress: '0x0',
          },
        },
      },
      {
        key: '2',
        info: 'Staked 4.95 CLNY',
        userProps: {
          user: {
            profile: { displayName: 'ChuckieChukie' },
            walletAddress: '0x1',
          },
        },
      },
      {
        key: '3',
        info: 'Staked 1.23 CLNY',
        userProps: {
          user: {
            profile: { displayName: 'Reallylongusername' },
            walletAddress: '0x2',
          },
        },
      },
    ],
  },
};

export default userInfoListMeta;

export const Base: StoryObj<typeof UserInfoList> = {};
