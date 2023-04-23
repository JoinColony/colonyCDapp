import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { noMotionsVotingReputationVersion } from '~types';

import styles from './CannotCreateMotionMessage.css';

const displayName = 'CannotCreateMotionMessage';

const MSG = defineMessages({
  message: {
    id: `${displayName}.message`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const CannotCreateMotionMessage = () => (
  <div className={styles.cannotCreateMotionMessage}>
    <FormattedMessage
      {...MSG.message}
      values={{
        version: noMotionsVotingReputationVersion,
      }}
    />
  </div>
);

export default CannotCreateMotionMessage;
