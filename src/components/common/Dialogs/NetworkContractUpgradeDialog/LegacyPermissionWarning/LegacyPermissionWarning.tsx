import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import PermissionsLabel from '~shared/PermissionsLabel';

import styles from './LegacyPermissionWarning.css';

const displayName =
  'common.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm.LegacyPermissionWarning';

const MSG = defineMessages({
  legacyPermissionsWarningTitle: {
    id: `${displayName}.legacyPermissionsWarningTitle`,
    defaultMessage: `Upgrade to the next colony version is prevented while more than one colony member has the {recoveryRole} role.`,
  },
  legacyPermissionsWarningDescription: {
    id: `${displayName}.legacyPermissionsWarningDescription`,
    defaultMessage: `
      Please remove the {recoveryRole} role from all members {highlightInstruction}
      the member who will upgrade the colony. Once complete, you will be able to
      safely upgrade the colony to the next version.
    `,
  },
  legacyPermissionsWarningPost: {
    id: `${displayName}.legacyPermissionsWarningPost`,
    defaultMessage: `After the upgrade you can safely re-assign the {recoveryRole} role to members.`,
  },
  legacyPermissionsWarninghighlightInstruction: {
    id: `${displayName}.highlightInstruction`,
    defaultMessage: `except`,
  },
});

const LegacyPermissionWarning = () => (
  <div className={styles.permissionsWarning}>
    <div className={styles.warningTitle}>
      <FormattedMessage
        {...MSG.legacyPermissionsWarningTitle}
        values={{
          recoveryRole: <PermissionsLabel permission={ColonyRole.Recovery} />,
        }}
      />
    </div>
    <div className={styles.warningDescription}>
      <FormattedMessage
        {...MSG.legacyPermissionsWarningDescription}
        values={{
          recoveryRole: <PermissionsLabel permission={ColonyRole.Recovery} />,
          highlightInstruction: (
            <span className={styles.highlightInstruction}>
              <FormattedMessage
                {...MSG.legacyPermissionsWarninghighlightInstruction}
              />
            </span>
          ),
        }}
      />
    </div>
    <div className={styles.warningDescription}>
      <FormattedMessage
        {...MSG.legacyPermissionsWarningPost}
        values={{
          recoveryRole: <PermissionsLabel permission={ColonyRole.Recovery} />,
        }}
      />
    </div>
  </div>
);

LegacyPermissionWarning.displayName = displayName;

export default LegacyPermissionWarning;
