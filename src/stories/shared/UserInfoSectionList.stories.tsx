import type { Meta, StoryObj } from '@storybook/react';
import UserInfoSectionList from '~v5/shared/UserInfoSectionList';

const userInfoSectionListMeta: Meta<typeof UserInfoSectionList> = {
  title: 'Shared/User Info Section List',
  component: UserInfoSectionList,
  args: {
    sections: [
      {
        key: '1',
        heading: {
          status: 'support',
        },
        items: [
          {
            key: '1',
            info: 'Staked 5.67 CLNY',
            userProps: {
              userName: 'JohnnyBravo',
            },
          },
          {
            key: '2',
            info: 'Staked 4.95 CLNY',
            userProps: {
              userName: 'ChuckieChuckie',
            },
          },
          {
            key: '3',
            info: 'Staked 1.23 CLNY',
            userProps: {
              userName: 'Reallylongusername',
            },
          },
        ],
      },
      {
        key: '2',
        heading: {
          status: 'oppose',
        },
        items: [
          {
            key: '1',
            info: 'Staked 5.67 CLNY',
            userProps: {
              userName: 'JohnnyBravo',
            },
          },
          {
            key: '2',
            info: 'Staked 4.95 CLNY',
            userProps: {
              userName: 'ChuckieChuckie',
            },
          },
          {
            key: '3',
            info: 'Staked 1.23 CLNY',
            userProps: {
              userName: 'Reallylongusername',
            },
          },
        ],
      },
    ],
  },
};

export default userInfoSectionListMeta;

export const Base: StoryObj<typeof UserInfoSectionList> = {};
