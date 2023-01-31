import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { useFormContext } from 'react-hook-form';
import Decimal from 'decimal.js';

import { calculateFee, getTokenDecimalsWithFallback } from '~utils/tokens';
import { notNull } from '~utils/arrays';
import Numeral from '~shared/Numeral';
import { Colony } from '~types';

import styles from './NetworkFee.css';

const displayName =
  'common.CreatePaymentDialog.CreatePaymentDialogForm.NetworkFee';

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
  colony: Colony | undefined;
  customAmountError: string | MessageDescriptor | undefined;
  networkFeeInverse: string | undefined;
}

const NetworkFee = ({
  colony,
  networkFeeInverse,
  customAmountError,
}: Props) => {
  const { getValues } = useFormContext();
  const values = getValues();
  const colonyTokens =
    colony?.tokens?.items
      .filter(notNull)
      .map((colonyToken) => colonyToken.token) || [];
  const selectedToken = colonyTokens.find(
    (token) => token?.tokenAddress === values.tokenAddress,
  );

  if (
    !networkFeeInverse &&
    customAmountError &&
    new Decimal(values.amount).isZero()
  ) {
    return null;
  }

  return (
    <div className={styles.networkFee}>
      <FormattedMessage
        {...MSG.fee}
        values={{
          fee: (
            <Numeral
              // appearance={{
              //   size: 'small',
              //   theme: 'grey',
              // }}
              value={
                calculateFee(
                  values.amount,
                  networkFeeInverse!,
                  getTokenDecimalsWithFallback(selectedToken?.decimals),
                ).feesInWei
              }
              decimals={getTokenDecimalsWithFallback(selectedToken?.decimals)}
            />
          ),
          symbol: selectedToken?.symbol || '???',
        }}
      />
    </div>
  );
};

export default NetworkFee;
