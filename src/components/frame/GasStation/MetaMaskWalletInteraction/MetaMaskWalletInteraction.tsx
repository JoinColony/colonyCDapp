import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~shared/Icon';

import styles from './MetaMaskWalletInteraction.css';

const displayName = 'frame.GasStation.MetaMaskWalletInteraction';

const MSG = defineMessages({
  metamaskPromptText: {
    id: `{displayName}.metamaskPromptText`,
    defaultMessage: `Please finish this {isMetatransaction, select,
      true {metatransaction}
      false {transaction}
      other {action}
    } on MetaMask`,
  },
});

interface Props {
  transactionType?: string;
}

const MetaMaskWalletInteraction = ({ transactionType }: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <Icon
          name="metamask"
          title={{ id: 'wallet.metamask' }}
          appearance={{ size: 'medium' }}
        />
        <span className={styles.text}>
          <FormattedMessage
            {...MSG.metamaskPromptText}
            values={{
              isMetatransaction: !transactionType
                ? undefined
                : transactionType === 'metatransaction',
            }}
          />
        </span>
      </div>
    </div>
  );
};

MetaMaskWalletInteraction.displayName = displayName;

export default MetaMaskWalletInteraction;
