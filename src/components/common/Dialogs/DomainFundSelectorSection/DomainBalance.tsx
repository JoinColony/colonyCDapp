import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { Token, Colony } from '~types';
import { getTokenDecimalsWithFallback, getSelectedToken, getBalanceForTokenAndDomain } from '~utils/tokens';
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
  domainFieldName: string;
}

const getDomainFundMessageValues = (colony: Colony, selectedToken: Token, fromDomain: number) => ({
  amount: (
    <Numeral
      value={getBalanceForTokenAndDomain(colony.balances, selectedToken.tokenAddress, fromDomain)}
      decimals={getTokenDecimalsWithFallback(selectedToken?.decimals)}
    />
  ),
  symbol: selectedToken?.symbol || '???',
});

const DomainBalance = ({ colony, domainFieldName }: Props) => {
  const { watch } = useFormContext();
  const tokenAddress = watch('tokenAddress');
  const domainId = watch(domainFieldName);
  const selectedToken = getSelectedToken(colony, tokenAddress);

  if (!selectedToken) {
    return null;
  }

  return (
    <div className={styles.domainPotBalance}>
      <FormattedMessage
        {...MSG.domainTokenAmount}
        values={getDomainFundMessageValues(colony, selectedToken, domainId)}
      />
    </div>
  );
};

DomainBalance.displayName = displayName;

export default DomainBalance;
