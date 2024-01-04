import React, { ReactNode } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ADD_SAFE_INSTRUCTIONS } from '~constants/externalUrls';
import ExternalLink from '~shared/ExternalLink';
import Icon from '~shared/Icon';

import styles from './SetupSafeCallout.css';

const displayName =
  'common.AddExistingSafeDialog.AddExistingSafeDialogForm.CheckSafe.SetupSafeCallout';

const MSG = defineMessages({
  callout: {
    id: `${displayName}.callout`,
    defaultMessage: '<span>Important!</span>  Read the instructions first.',
  },
  calloutLink: {
    id: `${displayName}.calloutLink`,
    defaultMessage: 'Set up instructions',
  },
  important: {
    id: `${displayName}.important`,
    defaultMessage: 'Important!',
  },
});

const CalloutWarning = (chunks: ReactNode) => (
  <span className={styles.calloutWarning}>{chunks}</span>
);

const SetupSafeCallout = () => (
  <div className={styles.callout}>
    <div className={styles.calloutContainer}>
      <Icon
        name="triangle-warning"
        className={`${styles.warningIcon} ${styles.warningIconCheckSafe}`}
        title={MSG.important}
      />
      <FormattedMessage
        {...MSG.callout}
        values={{
          span: CalloutWarning,
        }}
      />
    </div>
    <ExternalLink href={ADD_SAFE_INSTRUCTIONS} className={styles.calloutLink}>
      <FormattedMessage {...MSG.calloutLink} />
    </ExternalLink>
  </div>
);

SetupSafeCallout.displayName = displayName;

export default SetupSafeCallout;
