import React from 'react';

import MemberCard from '~v5/common/MemberCard/index.ts';
import MemberCardList from '~v5/common/MemberCardList/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

const memberCardListMeta: Meta<typeof MemberCardList> = {
  title: 'Common/Member Card List',
  component: MemberCardList,
  args: {
    children: (
      <>
        <MemberCard
          key="1"
          userAddress=""
          user={{
            profile: {
              bio: 'CaptainPlanet',
              displayName: 'CaptainPlanet',
            },
            walletAddress: '',
          }}
          meatBallMenuProps={{
            items: [
              {
                key: '1',
                label: 'test',
                onClick: () => {},
              },
            ],
          }}
          reputation={42}
          domains={[]}
          isVerified
          contributorType={undefined}
        />

        <MemberCard
          key="2"
          userAddress=""
          user={{
            profile: {
              bio: 'panda',
              displayName: 'panda',
            },
            walletAddress: '',
          }}
          meatBallMenuProps={{
            items: [
              {
                key: '1',
                label: 'test',
                onClick: () => {},
              },
            ],
          }}
          reputation={37}
          domains={[]}
          isVerified
          contributorType={undefined}
        />

        <MemberCard
          key="3"
          userAddress=""
          user={{
            profile: {
              bio: 'shredder',
              displayName: 'shredder',
            },
            walletAddress: '',
          }}
          meatBallMenuProps={{
            items: [
              {
                key: '1',
                label: 'test',
                onClick: () => {},
              },
            ],
          }}
          reputation={22}
          domains={[]}
          isVerified={false}
          contributorType={undefined}
        />

        <MemberCard
          key="4"
          userAddress=""
          user={{
            profile: {
              bio: 'RodgerRamjet',
              displayName: 'RodgerRamjet',
            },
            walletAddress: '',
          }}
          meatBallMenuProps={{
            items: [
              {
                key: '1',
                label: 'test',
                onClick: () => {},
              },
            ],
          }}
          reputation={13}
          domains={[]}
          isVerified
          contributorType={undefined}
        />

        <MemberCard
          key="5"
          userAddress=""
          user={{
            profile: {
              bio: 'rocko',
              displayName: 'rocko',
            },
            walletAddress: '',
          }}
          meatBallMenuProps={{
            items: [
              {
                key: '1',
                label: 'test',
                onClick: () => {},
              },
            ],
          }}
          reputation={9}
          domains={[]}
          isVerified
          contributorType={undefined}
        />

        <MemberCard
          key="6"
          userAddress=""
          user={{
            profile: {
              bio: 'ChuckieFinster',
              displayName: 'ChuckieFinster',
            },
            walletAddress: '',
          }}
          meatBallMenuProps={{
            items: [
              {
                key: '1',
                label: 'test',
                onClick: () => {},
              },
            ],
          }}
          reputation={6}
          domains={[]}
          isVerified
          contributorType={undefined}
        />

        <MemberCard
          key="7"
          userAddress=""
          user={{
            profile: {
              bio: 'heyarnold',
              displayName: 'heyarnold',
            },
            walletAddress: '',
          }}
          meatBallMenuProps={{
            items: [
              {
                key: '1',
                label: 'test',
                onClick: () => {},
              },
            ],
          }}
          reputation={5}
          domains={[]}
          isVerified
          contributorType={undefined}
        />
      </>
    ),
  },
};

export default memberCardListMeta;

export const Base: StoryObj<typeof MemberCardList> = {};

export const Simple: StoryObj<typeof MemberCardList> = {
  args: {
    isSimple: true,
  },
};
