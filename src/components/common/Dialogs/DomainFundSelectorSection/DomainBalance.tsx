import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { Token, Colony } from '~types';
import { getTokenDecimalsWithFallback, getSelectedToken } from '~utils/tokens';
import Numeral from '~shared/Numeral';

import styles from './DomainFundSelector.css';

const displayName = `common.CreatePaymentDialog.CreatePaymentDialogForm.DomainFundSelector.DomainBalance`;

const MSG = defineMessages({
  domainTokenAmount: {
    id: `${displayName}.domainTokenAmount`,
    defaultMessage: 'Available Funds: {amount} {symbol}',
  },
});

interface Props {
  colony: Colony;
}

const getDomainFundMessageValues = (selectedToken: Token | undefined) => ({
  amount: (
    <Numeral
      value={0} // fromDomainTokenBalance || ...
      decimals={getTokenDecimalsWithFallback(selectedToken?.decimals)}
    />
  ),
  symbol: selectedToken?.symbol || '???',
});

const DomainBalance = ({ colony }: Props) => {
  const { watch } = useFormContext();
  const tokenAddress = watch('tokenAddress');
  const selectedToken = getSelectedToken(colony, tokenAddress);

  return (
    <div className={styles.domainPotBalance}>
      <FormattedMessage {...MSG.domainTokenAmount} values={getDomainFundMessageValues(selectedToken)} />
    </div>
  );
};

DomainBalance.displayName = displayName;

export default DomainBalance;
