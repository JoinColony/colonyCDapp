import { Network } from '~gql';
import { WatchListItem } from '~types';

export const watchlistMock: WatchListItem[] = [
  {
    colony: {
      __typename: 'Colony',
      colonyAddress: '0xA4b4F5d9DBe383206Bd11C0e447F4462B9ea6cAE',
      name: 'c',
      chainMetadata: {
        chainId: 2656691,
        network: Network.Gnosis,
        __typename: 'ChainMetadata',
      },
      metadata: {
        avatar: '',
        changelog: null,
        displayName: 'Colony C',
        thumbnail: '',
      },
    },
    createdAt: '2023-05-08T09:04:15.248Z',
    __typename: 'WatchedColonies',
  },
  {
    colony: {
      __typename: 'Colony',
      colonyAddress: '0x2af64AC5377e2F841362c734F5eDCa3C2789a9Bf',
      name: 'b',
      chainMetadata: {
        chainId: 2656691,
        network: Network.Gnosis,
        __typename: 'ChainMetadata',
      },
      metadata: {
        avatar: '',
        changelog: null,
        displayName: 'Colony B',
        thumbnail: '',
      },
    },
    createdAt: '2023-05-08T09:04:14.855Z',
    __typename: 'WatchedColonies',
  },
  {
    colony: {
      __typename: 'Colony',
      colonyAddress: '0x3a157280ca91bB49dAe3D1619C55Da7F9D4438c3',
      name: 'a',
      chainMetadata: {
        chainId: 2656691,
        network: Network.Gnosis,
        __typename: 'ChainMetadata',
      },
      metadata: {
        avatar: '',
        changelog: null,
        displayName: 'Colony A',
        thumbnail: '',
      },
    },
    createdAt: '2023-05-08T09:03:46.132Z',
    __typename: 'WatchedColonies',
  },
];
