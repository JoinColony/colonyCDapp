import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import { useUserReputation } from '~hooks';

import MemberReputation from '../MemberReputation';

import styles from './ConfusableWarning.css';

interface Props {
  walletAddress?: string;
  colonyAddress?: string;
}

const displayName = 'ConfusableWarning';

const MSG = {
  warningText: {
    id: `${displayName}.warningText`,
    defaultMessage: `<span>Warning.</span> This username has confusable characters; it may be trying to impersonate another user.`,
  },
  warningCurrentUserText: {
    id: `${displayName}.warningCurrentUserText`,
    defaultMessage: `<span>Warning.</span> Your username has confusable characters. This will show a warning when selected by users.`,
  },
  reputationLabel: {
    id: `${displayName}.reputationLabel`,
    defaultMessage: "Recipient's reputation",
  },
};

const WarningLabel = (chunks: React.ReactNode[]) => <span className={styles.warningLabel}>{chunks}</span>;

const ConfusableWarning = ({ walletAddress, colonyAddress }: Props) => {
  const { userReputation, totalReputation } = useUserReputation(colonyAddress, walletAddress);
  return (
    <>
      <div
        className={classnames(styles.warningContainer, {
          [styles.noReputation]: !walletAddress && !colonyAddress,
        })}
      >
        <p className={styles.warningText}>
          <FormattedMessage
            {...(!walletAddress && !colonyAddress ? MSG.warningCurrentUserText : MSG.warningText)}
            values={{
              span: WarningLabel,
            }}
          />
        </p>
      </div>
      {walletAddress && colonyAddress && (
        <div className={styles.reputationContainer}>
          <div className={styles.reputationLabel}>
            <FormattedMessage {...MSG.reputationLabel} />
          </div>
          <MemberReputation userReputation={userReputation} totalReputation={totalReputation} />
        </div>
      )}
    </>
  );
};

export default ConfusableWarning;
