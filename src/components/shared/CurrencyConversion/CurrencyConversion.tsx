import Decimal from 'decimal.js';
import { type BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import React from 'react';

import { DEFAULT_NETWORK } from '~constants';
import { useCurrencyContext } from '~context/CurrencyContext/CurrencyContext.ts';
import useCurrency from '~hooks/useCurrency.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { type NumeralProps } from '~shared/Numeral/types.ts';
import { type Network } from '~types/network.ts';
import { type FetchCurrentPriceArgs } from '~utils/currency/index.ts';

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

  /** Balance of token to be converted */
  tokenBalance: BigNumber;

  /** Decimals of the token */
  tokenDecimals: number;
}

const CurrencyConversion = ({
  showPrefix = true,
  showSuffix = true,
  placeholder = '-',
  tokenBalance,
  tokenDecimals,
  contractAddress,
  chainId = DEFAULT_NETWORK as Network,
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
      value={
        conversionRate == null
          ? placeholder
          : new Decimal(
              moveDecimal(tokenBalance.toString(), -tokenDecimals),
            ).mul(conversionRate)
      }
      {...rest}
    />
  );
};

CurrencyConversion.displayName = displayName;

export default CurrencyConversion;
