import type { Meta, StoryObj } from '@storybook/react';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { Watcher } from '~types';
import MembersAvatars from '~v5/shared/MembersAvatars';

const items: Watcher[] = [
  {
    __typename: 'Watcher',
    address: '0xb3816008946dD5EdDdf32393484d80b4f081E9f8',
    user: {
      __typename: 'User',
      walletAddress: '0xb3816008946dD5EdDdf32393484d80b4f081E9f8',
      profile: {
        __typename: 'Profile',
        avatar: null,
        bio: null,
        displayName: 'Czarek2',
        displayNameChanged: '2023-10-24T08:04:25.882Z',
        email: 'example.com',
        location: null,
        thumbnail: null,
        website: null,
        meta: {
          __typename: 'ProfileMetadata',
          emailPermissions: [],
          metatransactionsEnabled: null,
          decentralizedModeEnabled: null,
          customRpc: null,
        },
      },
    },
  },
  {
    __typename: 'Watcher',
    address: '0xf0f930dc24790d00c34d9db354319447f7be6ecc',
    user: {
      __typename: 'User',
      walletAddress: '0xF0F930Dc24790D00C34D9Db354319447F7bE6eCC',
      profile: {
        __typename: 'Profile',
        avatar: null,
        bio: null,
        displayName: 'krawczykk2',
        displayNameChanged: '2023-10-24T08:04:25.882Z',
        email: 'example.com',
        location: null,
        thumbnail: null,
        website: null,
        meta: {
          __typename: 'ProfileMetadata',
          emailPermissions: [],
          metatransactionsEnabled: null,
          decentralizedModeEnabled: null,
          customRpc: null,
        },
      },
    },
  },
  {
    __typename: 'Watcher',
    address: '0x67a781fc582C7a27587EFdB1E4AF8004fEc6b88C',
    user: {
      __typename: 'User',
      walletAddress: '0x67a781fc582C7a27587EFdB1E4AF8004fEc6b88C',
      profile: {
        __typename: 'Profile',
        avatar: null,
        bio: null,
        displayName: 'testQA',
        displayNameChanged: '2023-10-24T08:04:25.882Z',
        email: 'example.com',
        location: null,
        thumbnail: null,
        website: null,
        meta: {
          __typename: 'ProfileMetadata',
          emailPermissions: [],
          metatransactionsEnabled: null,
          decentralizedModeEnabled: null,
          customRpc: null,
        },
      },
    },
  },
  {
    __typename: 'Watcher',
    address: '0x37842D3196cDA643252B125def5D89a78C03b5b7',
    user: {
      __typename: 'User',
      walletAddress: '0x37842D3196cDA643252B125def5D89a78C03b5b7',
      profile: {
        __typename: 'Profile',
        avatar: null,
        bio: null,
        displayName: 'joanna_chmiel',
        displayNameChanged: '2023-10-24T08:04:25.882Z',
        email: 'example.com',
        location: null,
        thumbnail: null,
        website: null,
        meta: {
          __typename: 'ProfileMetadata',
          emailPermissions: [],
          metatransactionsEnabled: null,
          decentralizedModeEnabled: null,
          customRpc: null,
        },
      },
    },
  },
  {
    __typename: 'Watcher',
    address: '0x7fDab0917F1E0A283afce9d9044F57dd15A9A9F5',
    user: {
      __typename: 'User',
      walletAddress: '0x7fDab0917F1E0A283afce9d9044F57dd15A9A9F5',
      profile: {
        __typename: 'Profile',
        avatar: null,
        bio: null,
        displayName: 'adrian.pagepro',
        displayNameChanged: '2023-10-24T08:04:25.882Z',
        email: 'example.com',
        location: null,
        thumbnail: null,
        website: null,
        meta: {
          __typename: 'ProfileMetadata',
          emailPermissions: [],
          metatransactionsEnabled: null,
          decentralizedModeEnabled: null,
          customRpc: null,
        },
      },
    },
  },
];

const meta: Meta<typeof MembersAvatars> = {
  title: 'Shared/Members avatars',
  component: MembersAvatars,
  args: {
    currentDomainId: COLONY_TOTAL_BALANCE_DOMAIN_ID,
    maxAvatars: 4,
    items,
  },
};

export default meta;
type Story = StoryObj<typeof MembersAvatars>;

export const Base: Story = {};

export const DefinedAvatarNumbers: Story = {
  args: {
    maxAvatars: 2,
  },
};
