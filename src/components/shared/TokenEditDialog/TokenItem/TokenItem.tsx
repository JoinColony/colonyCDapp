import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~shared/Heading';
import { HookFormCheckbox as Checkbox } from '~shared/Fields';
import TokenIcon from '~shared/TokenIcon';
import { Token } from '~types';

import styles from './TokenItem.css';

const displayName = 'TokenEditDialog.TokenItem';

const MSG = defineMessages({
  unknownToken: {
    id: `${displayName}.unknownToken`,
    defaultMessage: 'Unknown Token',
  },
});

interface Props {
  token: Token;
  disabled?: boolean;
}

const TokenItem = ({
  token: { symbol, name, tokenAddress: address },
  token,
  disabled = false,
}: Props) => {
  return (
    <div className={styles.main} data-test="tokenEditItem">
      <div className={styles.tokenChoice}>
        <Checkbox
          name="selectedTokenAddresses"
          value={address}
          className={styles.checkbox}
          disabled={disabled}
        />
        <TokenIcon token={token} size="xs" />
        <span className={styles.tokenChoiceSymbol}>
          <Heading
            text={symbol || name || MSG.unknownToken}
            appearance={{ size: 'normal', margin: 'none', theme: 'dark' }}
          />
          {(!!symbol && name) || address}
        </span>
      </div>
    </div>
  );
};

TokenItem.displayName = displayName;

export default TokenItem;
