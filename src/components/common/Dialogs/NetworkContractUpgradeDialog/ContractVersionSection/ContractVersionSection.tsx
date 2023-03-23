import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import styles from './ContractVersionSection.css';

const displayName =
  'common.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.LegacyPermissionWarning';

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
  currentVersion: number;
}

const LegacyPermissionWarning = ({ currentVersion }: Props) => {
  const nextVersion = currentVersion + 1;
  const networkVersion = 1; // newVersion - @TODO: This value comes from useNetworkContracts() in the Dapp. To be wired up.

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
          {nextVersion < networkVersion ? nextVersion : networkVersion}
        </div>
      </div>
      <hr className={styles.divider} />
    </>
  );
};

LegacyPermissionWarning.displayName = displayName;

export default LegacyPermissionWarning;
