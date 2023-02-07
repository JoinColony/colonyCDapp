import React, { useMemo } from 'react';
import { defineMessages } from 'react-intl';
import { AddressZero } from '@ethersproject/constants';
import { useFormContext } from 'react-hook-form';

import { HookFormInput as Input, TokenSymbolSelector } from '~shared/Fields';
import EthUsd from '~shared/EthUsd';
import { getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';
import { notNull } from '~utils/arrays';
import { Colony } from '~types';

// import NetworkFee from '../NetworkFee';

import styles from './TokenAmountInput.css';

const displayName =
  'common.CreatePaymentDialog.CreatePaymentDialogForm.TokenAmountInput';

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
}

const TokenAmountInput = ({ colony, disabled }: Props) => {
  const { getValues } = useFormContext();
  const values = getValues();
  const selectedToken = getSelectedToken(colony, values.tokenAddress);
  const colonyTokens =
    colony?.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];
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
          label={MSG.amount}
          name="amount"
          appearance={{
            theme: 'minimal',
            align: 'right',
          }}
          formattingOptions={formattingOptions}
          disabled={disabled}
          dataTest="paymentAmountInput"
        />
        {/* <NetworkFee colony={colony} networkFeeInverse={networkFeeInverse} customAmountError={customAmountError} /> */}
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
          />
        </div>
        {values.tokenAddress === AddressZero && (
          <div className={styles.tokenAmountUsd}>
            <EthUsd
              // appearance={{ theme: 'grey' }}
              value={values.amount}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenAmountInput;
