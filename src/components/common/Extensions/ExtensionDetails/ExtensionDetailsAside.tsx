import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ActionTypes } from '~redux';
import { DialogActionButton } from '~shared/Button';
import { ConfirmDialog } from '~shared/Dialog';
import { Table, TableBody, TableRow, TableCell } from '~shared/Table';
import { AnyExtensionData } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';

import ExtensionActionButton from '../ExtensionActionButton';
import ExtensionStatusBadge from '../ExtensionStatusBadge';

import styles from './ExtensionDetails.css';

const displayName = 'common.Extensions.ExtensionDetails.ExtensionDetailsAside';

const MSG = defineMessages({
  status: {
    id: `${displayName}.status`,
    defaultMessage: 'Status',
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
  colonyAddress: string;
}

const ExtensionDetailsAside = ({
  extensionData,
  canBeDeprecated,
  canBeUninstalled,
  colonyAddress,
}: Props) => {
  const { extensionId } = extensionData;

  // @TODO: Display all available data
  const tableData = isInstalledExtensionData(extensionData)
    ? [
        {
          label: MSG.status,
          value: <ExtensionStatusBadge extensionData={extensionData} />,
        },
      ]
    : [
        {
          label: MSG.status,
          value: <ExtensionStatusBadge extensionData={extensionData} />,
        },
      ];

  return (
    <aside>
      <div className={styles.buttonWrapper}>
        <ExtensionActionButton extensionData={extensionData} />
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
