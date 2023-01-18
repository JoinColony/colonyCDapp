import React from 'react';
import { MessageDescriptor, defineMessages, FormattedDate } from 'react-intl';

import { AnyExtensionData, Colony } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';
import DetailsWidgetUser from '~shared/DetailsWidgetUser';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import MaskedAddress from '~shared/MaskedAddress';

import ExtensionStatusBadge from '../ExtensionStatusBadge';
import { displayName } from './ExtensionDetailsAside';

import styles from './ExtensionDetails.css';

const MSG = defineMessages({
  status: {
    id: `${displayName}.status`,
    defaultMessage: 'Status',
  },
  installedBy: {
    id: `${displayName}.installedBy`,
    defaultMessage: 'Installed by',
  },
  dateInstalled: {
    id: `${displayName}.dateInstalled`,
    defaultMessage: 'Date installed',
  },
  dateCreated: {
    id: `${displayName}.dateCreated`,
    defaultMessage: 'Date created',
  },
  latestVersion: {
    id: `${displayName}.latestVersion`,
    defaultMessage: 'Latest version',
  },
  developer: {
    id: `${displayName}.developer`,
    defaultMessage: 'Developer',
  },
  versionInstalled: {
    id: `${displayName}.versionInstalled`,
    defaultMessage: 'Version installed',
  },
  contractAddress: {
    id: `${displayName}.contractAddress`,
    defaultMessage: 'Contract address',
  },
});

export type TableRowData = {
  label: MessageDescriptor;
  value: string | JSX.Element;
};

export const getTableData = (
  extensionData: AnyExtensionData,
  colony: Colony,
): TableRowData[] => {
  const statusRow = {
    label: MSG.status,
    value: <ExtensionStatusBadge extensionData={extensionData} />,
  };
  const developerRow = {
    label: MSG.developer,
    value: 'Colony',
  };

  if (isInstalledExtensionData(extensionData)) {
    return [
      statusRow,
      {
        label: MSG.installedBy,
        value: (
          <span className={styles.installedBy}>
            <DetailsWidgetUser
              colony={colony}
              walletAddress={extensionData.installedBy}
            />
          </span>
        ),
      },
      {
        label: MSG.dateInstalled,
        value: <FormattedDate value={extensionData.installedAt * 1000} />,
      },
      {
        label: MSG.versionInstalled,
        value: `v${extensionData.currentVersion}`,
      },
      {
        label: MSG.contractAddress,
        value: (
          <InvisibleCopyableAddress address={extensionData.address}>
            <span className={styles.contractAddress}>
              <MaskedAddress address={extensionData.address} />
            </span>
          </InvisibleCopyableAddress>
        ),
      },
      developerRow,
    ];
  }

  return [
    statusRow,
    {
      label: MSG.dateCreated,
      value: <FormattedDate value={extensionData.createdAt} />,
    },
    {
      label: MSG.latestVersion,
      value: `v${extensionData.availableVersion}`,
      // @TODO: Add extension compatibility map
      // icon: !extensionCompatible && (
      //   <Icon name="triangle-warning" title={MSG.warning} />
      // ),
    },
    developerRow,
  ];
};
