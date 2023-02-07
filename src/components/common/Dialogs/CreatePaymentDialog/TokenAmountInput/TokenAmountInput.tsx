import React from 'react';
import { defineMessages } from 'react-intl';
import { AddressZero } from '@ethersproject/constants';
import { useFormContext } from 'react-hook-form';

import { HookFormInput as Input, TokenSymbolSelector } from '~shared/Fields';
import EthUsd from '~shared/EthUsd';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { notNull } from '~utils/arrays';
import { useColonyContext } from '~hooks';

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
  disabled: boolean;
}

const TokenAmountInput = ({ disabled }: Props) => {
  const { getValues } = useFormContext();
  const { colony } = useColonyContext();
  const values = getValues();
  const colonyTokens =
    colony?.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];
  const selectedToken = colonyTokens.find(
    (token) => token?.tokenAddress === values.tokenAddress,
  );
  const formattingOptions = {
    delimiter: ',',
    numeral: true,
    numeralDecimalScale: getTokenDecimalsWithFallback(
      selectedToken && selectedToken.decimals,
    ),
  };

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
        {/* <NetworkFee networkFeeInverse={networkFeeInverse} customAmountError={customAmountError} /> */}
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
