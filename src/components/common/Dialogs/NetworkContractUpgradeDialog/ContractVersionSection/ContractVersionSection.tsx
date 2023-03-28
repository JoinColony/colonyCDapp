import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Colony } from '~types';
import { canColonyBeUpgraded } from '~utils/checks';

import styles from './ContractVersionSection.css';

const displayName = 'common.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.LegacyPermissionWarning';

const MSG = defineMessages({
  currentVersion: {
    id: `${displayName}.currentVersion`,
    defaultMessage: 'Current version',
  },
  newVersion: {
    id: `${displayName}.newVersion`,
    defaultMessage: 'New version',
  },
});

interface Props {
  colony: Colony;
  currentVersion: number;
  colonyContractVersion: number;
}

const LegacyPermissionWarning = ({
  colony,
  currentVersion,
  colonyContractVersion,
}: Props) => {
  const nextVersion = currentVersion + 1;

  return (
    <>
      <div className={styles.contractVersionLine}>
        <FormattedMessage {...MSG.currentVersion} />
        <div className={styles.contractVersionNumber}>{currentVersion}</div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.contractVersionLine}>
        <FormattedMessage {...MSG.newVersion} />
        <div className={styles.contractVersionNumber}>
          {/* @NOTE: The '-' is a fallback in the case that colonyContractVersion is 0 (Hasn't finished loading or there was an error while fetching) */}
          {canColonyBeUpgraded(colony, colonyContractVersion)
            ? nextVersion
            : colonyContractVersion || '-'}
        </div>
      </div>
      <hr className={styles.divider} />
    </>
  );
};

LegacyPermissionWarning.displayName = displayName;

export default LegacyPermissionWarning;
