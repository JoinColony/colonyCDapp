import React from 'react';
import { BigNumber } from 'ethers';

import Numeral, { Props as NumeralProps } from '~shared/Numeral/Numeral';

import { useCurrency } from '~hooks';
import { useCurrencyContext } from '~context/CurrencyContext';
import { FetchCurrentPriceArgs } from '~utils/currency/types';

const displayName = 'CurrencyConversion';

interface Props extends Omit<NumeralProps, 'value'> {
  /** Should the prefix be visible? */
  showPrefix?: boolean;

  /** Should the suffix be visible? */
  showSuffix?: boolean;

  /** A placeholder to be shown while the conversion rate is calculated */
  placeholder?: string;

  /** Ether unit the number is notated in (e.g. 'ether' = 10^18 wei) */
  unit?: string;

  /** Contract address of token to be converted */
  contractAddress: string;

  /** The network of the token being converted */
  chainId?: FetchCurrentPriceArgs['chainId'];

  /** Contract address of token to be converted */
  tokenBalance: BigNumber;
}

const CurrencyConversion = ({
  showPrefix = true,
  showSuffix = true,
  placeholder = '-',
  tokenBalance,
  contractAddress,
  chainId,
  className,
  ...rest
}: Props) => {
  const { currency } = useCurrencyContext();
  const conversionRate = useCurrency({
    contractAddress,
    chainId,
    conversionDenomination: currency,
  });

  return (
    <Numeral
      className={className}
      prefix={showPrefix && conversionRate ? '~ ' : ''}
      suffix={showSuffix ? ` ${currency}` : ''}
      value={tokenBalance.mul(conversionRate) || placeholder}
      {...rest}
    />
  );
};

CurrencyConversion.displayName = displayName;

export default CurrencyConversion;
