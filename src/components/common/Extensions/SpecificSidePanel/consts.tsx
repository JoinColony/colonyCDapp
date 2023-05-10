import React from 'react';
import UserAvatarPopover from '~shared/Extensions/UserAvatarPopover';
import { colonyReputationItems, permissionsItems } from '~shared/Extensions/UserAvatarPopover/partials/consts';

export const sidePanelData = [
  {
    id: 0,
    statusType: {
      title: 'Status',
    },
    dateInstalled: {
      title: 'Date installed',
      date: '28 October 2020',
    },
    installedBy: {
      title: 'Installed by',
      component: (
        <UserAvatarPopover
          title="asdf"
          userName="Panda"
          walletAddress="0x155....1051"
          isVerified
          copyUrl
          aboutDescription="description"
          colonyReputation={colonyReputationItems}
          permissions={permissionsItems}
        />
      ),
    },
    versionInstalled: {
      title: 'Version installed',
      version: 'v3',
    },
    contractAddress: {
      title: 'Contract address',
      address: '0x5083...Bb9a',
    },
    developer: {
      title: 'Developer',
      developer: 'Colony',
    },
    permissions: {
      title: 'Permissions the extension needs in the colony:',
      permissions: [
        {
          id: 0,
          title: 'Administrations',
        },
        {
          id: 1,
          title: 'Funding',
        },
        {
          id: 2,
          title: 'Arbitration',
        },
        {
          id: 3,
          title: 'Recovery',
        },
        {
          id: 4,
          title: 'Architecture',
        },
        {
          id: 5,
          title: 'Root',
        },
      ],
    },
  },
];
