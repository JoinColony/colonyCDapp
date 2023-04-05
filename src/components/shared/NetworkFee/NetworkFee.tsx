import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import {
  calculateFee,
  getSelectedToken,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import Numeral from '~shared/Numeral';
import { Colony } from '~types';
import { useNetworkInverseFee } from '~hooks';
import { toFinite } from '~utils/lodash';

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
}

const NetworkFee = ({ colony }: Props) => {
  const { watch } = useFormContext();
  const { networkInverseFee } = useNetworkInverseFee();
  const { tokenAddress, amount } = watch();
  const selectedToken = getSelectedToken(colony, tokenAddress);

  if (toFinite(amount || 0) === 0 || !networkInverseFee) {
    return null;
  }

  return (
    <div className={styles.networkFee}>
      <FormattedMessage
        {...MSG.fee}
        values={{
          fee: (
            <Numeral
              value={
                calculateFee(
                  amount,
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
