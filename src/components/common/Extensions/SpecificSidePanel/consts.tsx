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
          key: '1',
          text: 'Architecture',
          description:
            'This permission allows users to create new domains, and manage permissions within those domains.',
          name: 'clipboard-text',
        },
        {
          key: '2',
          text: 'Arbitration',
          description:
            'This permission allows users to create new domains, and manage permissions within those domains.',
          name: 'scales',
        },
        {
          key: '3',
          text: 'Recovery',
          description:
            'This permission allows users to create new domains, and manage permissions within those domains.',
          name: 'clock-counter-clockwise',
        },
        {
          key: '4',
          text: 'Funding',
          description:
            'This permission allows users to create new domains, and manage permissions within those domains.',
          name: 'bank',
        },
      ],
    },
  },
];
