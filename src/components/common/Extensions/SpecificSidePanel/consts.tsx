import React from 'react';

export const sidepanelData = [
  {
    id: 0,
    statusType: {
      title: 'Status',
    },
    dateInstalled: {
      title: 'Date installed',
      date: '28 October 2020',
    },
    instaledBy: {
      title: 'Installed by',
      component: <div />,
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
