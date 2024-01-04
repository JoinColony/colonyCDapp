import { AddressZero } from '@ethersproject/constants';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import EthUsd from '~shared/EthUsd';
import { Input, InputProps, TokenSymbolSelector } from '~shared/Fields';
import NetworkFee from '~shared/NetworkFee';
import { Colony } from '~types';
import { notNull } from '~utils/arrays';
import { toFinite } from '~utils/lodash';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';

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
    id: `${displayName}.token`,
    defaultMessage: 'Token',
  },
});

interface Props extends Pick<InputProps, 'label'> {
  colony: Colony;
  disabled?: boolean;
  includeNetworkFee?: boolean;
  tokenAddressFieldName?: string;
  amountFieldName?: string;
  disabledTokenAddress?: boolean;
}

const TokenAmountInput = ({
  colony,
  disabled,
  includeNetworkFee = false,
  tokenAddressFieldName = 'tokenAddress',
  amountFieldName = 'amount',
  label,
  disabledTokenAddress,
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
      numeralDecimalScale: getTokenDecimalsWithFallback(
        selectedToken && selectedToken.decimals,
      ),
    }),
    [selectedToken],
  );

  return (
    <div className={styles.tokenAmount}>
      <div className={styles.tokenAmountInputContainer}>
        <Input
          label={label ?? MSG.amount}
          name={amountFieldName}
          appearance={{
            theme: 'minimal',
            align: 'right',
          }}
          formattingOptions={formattingOptions}
          disabled={disabled}
          dataTest="paymentAmountInput"
        />
        {includeNetworkFee && <NetworkFee colony={colony} />}
      </div>
      <div className={styles.tokenAmountContainer}>
        <div className={styles.tokenAmountSelect}>
          <TokenSymbolSelector
            label={MSG.token}
            tokens={colonyTokens}
            name={tokenAddressFieldName}
            elementOnly
            appearance={{ alignOptions: 'right', theme: 'grey' }}
            disabled={disabled || !!disabledTokenAddress}
            onChange={() => {
              trigger(amountFieldName);
            }}
          />
        </div>
        {tokenAddress === AddressZero && (
          <div className={styles.tokenAmountUsd}>
            <EthUsd
              // appearance={{ theme: 'grey' }}
              value={toFinite(amount)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenAmountInput;
