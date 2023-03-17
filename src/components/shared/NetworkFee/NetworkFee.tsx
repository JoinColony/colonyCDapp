import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { useFormContext } from 'react-hook-form';
import Decimal from 'decimal.js';

import {
  calculateFee,
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
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
  colony: Colony;
  customAmountError: string | MessageDescriptor | undefined;
  networkInverseFee: string | undefined;
}

const NetworkFee = ({ colony, networkInverseFee }: Props) => {
  const { watch } = useFormContext();
  const { tokenAddress, amount } = watch();
  const selectedToken = getSelectedToken(colony, tokenAddress);
  const amountWithoutCommas = amount.replace(/,/g, ''); // @TODO: Remove this once a fix for the raw value of the inputs having commas is implemented.

  if (!networkInverseFee || new Decimal(amountWithoutCommas || 0).isZero()) {
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
                  amountWithoutCommas,
                  networkInverseFee,
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

NetworkFee.displayName = displayName;

export default NetworkFee;
