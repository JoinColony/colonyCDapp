import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { AddressZero } from '@ethersproject/constants';
import { useFormContext } from 'react-hook-form';

import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';
import { notNull } from '~utils/arrays';
import { Colony } from '~types';
import { HookFormInput as Input, TokenSymbolSelector } from '~shared/Fields';
import EthUsd from '~shared/EthUsd';
import NetworkFee from '~shared/NetworkFee';

import styles from './TokenAmountInput.css';

const displayName = 'TokenAmountInput';

const MSG = defineMessages({
  amount: {
    id: `${displayName}.amount`,
    defaultMessage: 'Amount',
  },
  fee: {
    id: `${displayName}.fee`,
    defaultMessage: 'Network fee: {fee} {symbol}',
  },
  token: {
    id: `${displayName}.address`,
    defaultMessage: 'Token',
  },
});

interface Props {
  colony: Colony;
  disabled: boolean;
  includeNetworkFee?: boolean;
}

const TokenAmountInput = ({
  colony,
  disabled,
  includeNetworkFee = false,
}: Props) => {
  const { watch, trigger } = useFormContext();
  const { amount, tokenAddress } = watch();

  const colonyTokens =
    colony?.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];
  const selectedToken = getSelectedToken(colony, tokenAddress);
  const formattingOptions = useMemo(
    () => ({
      delimiter: ',',
      numeral: true,
      numeralPositiveOnly: true,
      numeralDecimalScale: getTokenDecimalsWithFallback(selectedToken && selectedToken.decimals),
    }),
    [selectedToken],
  );

  return (
    <div className={styles.tokenAmount}>
      <div className={styles.tokenAmountInputContainer}>
        <Input
          label={MSG.amount}
          name="amount"
          appearance={{
            theme: 'minimal',
            align: 'right',
          }}
          formattingOptions={formattingOptions}
          disabled={disabled}
          dataTest="paymentAmountInput"
          // @NOTE: If we don't explicitly pass the amount value here, the input will lose their value when a different token is selected.
          // (Most likely to do with formattingOptions changing when the token changes?)
          value={amount}
        />
        {includeNetworkFee && <NetworkFee colony={colony} />}
      </div>
      <div className={styles.tokenAmountContainer}>
        <div className={styles.tokenAmountSelect}>
          <TokenSymbolSelector
            label={MSG.token}
            tokens={colonyTokens}
            name="tokenAddress"
            elementOnly
            appearance={{ alignOptions: 'right', theme: 'grey' }}
            disabled={disabled}
            onChange={() => {
              trigger('amount');
            }}
          />
        </div>
        {tokenAddress === AddressZero && (
          <div className={styles.tokenAmountUsd}>
            <EthUsd
              // appearance={{ theme: 'grey' }}
              value={amount}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenAmountInput;
