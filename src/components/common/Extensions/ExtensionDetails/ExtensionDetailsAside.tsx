import React from 'react';
import { defineMessages, FormattedDate, FormattedMessage } from 'react-intl';

import { ActionTypes } from '~redux';
import { DialogActionButton } from '~shared/Button';
import { ConfirmDialog } from '~shared/Dialog';
import { Table, TableBody, TableRow, TableCell } from '~shared/Table';
import { AnyExtensionData, InstalledExtensionData } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';
import { useColonyContext } from '~hooks';
import DetailsWidgetUser from '~shared/DetailsWidgetUser';
import InvisibleCopyableAddress from '~shared/InvisibleCopyableAddress';
import MaskedAddress from '~shared/MaskedAddress';

import ExtensionActionButton from '../ExtensionActionButton';
import ExtensionUpgradeButton from '../ExtensionUpgradeButton';
import ExtensionStatusBadge from '../ExtensionStatusBadge';

import styles from './ExtensionDetails.css';

const displayName = 'common.Extensions.ExtensionDetails.ExtensionDetailsAside';

const MSG = defineMessages({
  status: {
    id: `${displayName}.status`,
    defaultMessage: 'Status',
  },
  installedBy: {
    id: `${displayName}.ExtensionDetails.installedBy`,
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
  buttonDeprecate: {
    id: `${displayName}.buttonDeprecate`,
    defaultMessage: 'Deprecate',
  },
  headingDeprecate: {
    id: `${displayName}.headingDeprecate`,
    defaultMessage: 'Deprecate extension',
  },
  textDeprecate: {
    id: `${displayName}.textDeprecate`,
    defaultMessage: `This extension must first be deprecated if you wish to uninstall it. After deprecation, any actions using this extension already ongoing may be completed, but it will no longer be possible to create new actions requiring this extension. Are you sure you wish to proceed?`,
  },
  buttonReEnable: {
    id: `${displayName}.buttonReEnable`,
    defaultMessage: 'Re-enable',
  },
  headingReEnable: {
    id: `${displayName}.headingReEnable`,
    defaultMessage: 'Re-enable extension',
  },
  textReEnable: {
    id: `${displayName}.textReEnable`,
    defaultMessage: `The extension will be re-enabled with the same parameters. Are you sure you wish to proceed?`,
  },
  buttonUninstall: {
    id: `${displayName}.buttonUninstall`,
    defaultMessage: 'Uninstall',
  },
  headingUninstall: {
    id: `${displayName}.headingUninstall`,
    defaultMessage: 'Uninstall extension',
  },
  textUninstall: {
    id: `${displayName}.textUninstall`,
    defaultMessage: `This extension is currently deprecated, and may be uninstalled. Doing so will remove it from the colony and any processes requiring it will no longer work. Are you sure you wish to proceed?`,
  },
});

interface Props {
  extensionData: AnyExtensionData;
  canBeDeprecated: boolean;
  canBeUninstalled: boolean;
  canBeUpgraded: boolean;
}

const ExtensionDetailsAside = ({
  extensionData,
  canBeDeprecated,
  canBeUninstalled,
  canBeUpgraded,
}: Props) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  const { extensionId } = extensionData;
  const { colonyAddress } = colony;

  // @TODO: Display all available data
  const tableData = isInstalledExtensionData(extensionData)
    ? [
        {
          label: MSG.status,
          value: <ExtensionStatusBadge extensionData={extensionData} />,
        },
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
        {
          label: MSG.developer,
          value: 'Colony',
        },
      ]
    : [
        {
          label: MSG.status,
          value: <ExtensionStatusBadge extensionData={extensionData} />,
        },
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
        {
          label: MSG.developer,
          value: 'Colony',
        },
      ];

  return (
    <aside>
      <div className={styles.buttonWrapper}>
        <ExtensionActionButton extensionData={extensionData} />
        {canBeUpgraded && (
          <ExtensionUpgradeButton
            extensionData={extensionData as InstalledExtensionData}
          />
        )}
      </div>

      <Table appearance={{ theme: 'lined' }}>
        <TableBody>
          {tableData.map(
            ({
              label,
              value,
              // icon
            }) => (
              <TableRow key={label.id}>
                <TableCell className={styles.cellLabel}>
                  <FormattedMessage {...label} />
                  {/* {icon && <span className={styles.iconWrapper}>{icon}</span>} */}
                </TableCell>
                <TableCell className={styles.cellData}>{value}</TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>

      {canBeDeprecated && (
        <DialogActionButton
          dialog={ConfirmDialog}
          dialogProps={{
            heading: MSG.headingDeprecate,
            children: <FormattedMessage {...MSG.textDeprecate} />,
          }}
          appearance={{ theme: 'blue' }}
          submit={ActionTypes.EXTENSION_DEPRECATE}
          error={ActionTypes.EXTENSION_DEPRECATE_ERROR}
          success={ActionTypes.EXTENSION_DEPRECATE_SUCCESS}
          text={MSG.buttonDeprecate}
          values={{
            colonyAddress,
            extensionId,
            isToDeprecate: true,
          }}
        />
      )}
      {canBeUninstalled && (
        <>
          <DialogActionButton
            dialog={ConfirmDialog}
            dialogProps={{
              heading: MSG.headingReEnable,
              children: <FormattedMessage {...MSG.textReEnable} />,
            }}
            appearance={{ theme: 'blue' }}
            submit={ActionTypes.EXTENSION_DEPRECATE}
            error={ActionTypes.EXTENSION_DEPRECATE_ERROR}
            success={ActionTypes.EXTENSION_DEPRECATE_SUCCESS}
            text={MSG.buttonReEnable}
            values={{
              colonyAddress,
              extensionId,
              isToDeprecate: false,
            }}
          />
          <DialogActionButton
            dialog={ConfirmDialog}
            dialogProps={{
              heading: MSG.headingUninstall,
              children: <FormattedMessage {...MSG.textUninstall} />,
            }}
            appearance={{ theme: 'blue' }}
            submit={ActionTypes.EXTENSION_UNINSTALL}
            error={ActionTypes.EXTENSION_UNINSTALL_ERROR}
            success={ActionTypes.EXTENSION_UNINSTALL_SUCCESS}
            values={{
              colonyAddress,
              extensionId,
            }}
            text={MSG.buttonUninstall}
          />
        </>
      )}
    </aside>
  );
};

ExtensionDetailsAside.displayName = displayName;

export default ExtensionDetailsAside;
