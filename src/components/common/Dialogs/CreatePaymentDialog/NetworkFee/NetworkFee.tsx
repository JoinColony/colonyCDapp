import React from 'react';
import { defineMessages, FormattedMessage, MessageDescriptor } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import Decimal from 'decimal.js';

import { calculateFee, getSelectedToken, getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~shared/Numeral';
import { Colony } from '~types';

import styles from './NetworkFee.css';

const displayName = 'common.CreatePaymentDialog.CreatePaymentDialogForm.NetworkFee';

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
  customAmountError: string | MessageDescriptor | undefined;
  networkFeeInverse: string | undefined;
}

const NetworkFee = ({ colony, networkFeeInverse, customAmountError }: Props) => {
  const { watch } = useFormContext();
  const { tokenAddress, amount } = watch();
  const selectedToken = getSelectedToken(colony, tokenAddress);

  if (!networkFeeInverse || customAmountError || new Decimal(amount).isZero()) {
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
                calculateFee(amount, networkFeeInverse, getTokenDecimalsWithFallback(selectedToken?.decimals)).feesInWei
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

NetworkFee.displayName = displayName;

export default NetworkFee;
