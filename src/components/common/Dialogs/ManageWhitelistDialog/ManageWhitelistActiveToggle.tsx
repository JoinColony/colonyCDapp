import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { HookFormToggle as Toggle } from '~shared/Fields';
import { Heading4 } from '~shared/Heading';

import styles from './ManageWhitelistDialogForm.css';

const displayName = `common.ManageWhitelistDialog.ManageWhitelistDialogForm.ManageWhitelistActiveToggle`;

const MSG = defineMessages({
  toggleLabel: {
    id: `${displayName}.toggleLabel`,
    defaultMessage: `{isWhitelistActivated, select,
      true {Active}
      other {Inactive}
    }`,
  },
  headerTitle: {
    id: `${displayName}.headerTitle`,
    defaultMessage: 'Only show address book contacts as recipients',
  },
  tooltipText: {
    id: `${displayName}.tooltipText`,
    defaultMessage: `Address book is automatically activated when at least one address is added to the list. You can turn this feature “Off” to deactivate. Use with caution.`,
  },
  warningText: {
    id: `${displayName}.warningText`,
    defaultMessage: `<span>Warning.</span>
      You are deactivating your colony’s address book
      which is a list of addresses your colony has flagged as “safe”.
      Once this is deactivated, all addresses watching your colony will
      appear in recipient selection menus. Be vigilant against spoof accounts.`,
  },
});

interface Props {
  isWhitelistActivated: boolean;
}

const WarningLabel = (chunks: React.ReactNode[]) => <span className={styles.warningLabel}>{chunks}</span>;

const ManageWhitelistActiveToggle = ({ isWhitelistActivated }: Props) => (
  <>
    <div className={styles.toggleContainer}>
      <Heading4 appearance={{ margin: 'none', theme: 'dark' }} text={MSG.headerTitle} />
      <Toggle
        label={MSG.toggleLabel}
        labelValues={{ isWhitelistActivated }}
        name="isWhitelistActivated"
        tooltipText={MSG.tooltipText}
      />
    </div>
    {!isWhitelistActivated && (
      <div className={styles.warningContainer}>
        <p className={styles.warningText}>
          <FormattedMessage
            {...MSG.warningText}
            values={{
              span: WarningLabel,
            }}
          />
        </p>
      </div>
    )}
  </>
);

export default ManageWhitelistActiveToggle;

ManageWhitelistActiveToggle.displayName = displayName;
