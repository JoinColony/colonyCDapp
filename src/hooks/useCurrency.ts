import { useEffect, useState } from 'react';

import { SupportedCurrencies } from '~gql';
import { Network } from '~types/network.ts';
import {
  fetchCurrentPrice,
  type FetchCurrentPriceArgs,
} from '~utils/currency/index.ts';

const useCurrency = ({
  contractAddress,
  chainId = Network.ArbitrumOne,
  conversionDenomination = SupportedCurrencies.Usd,
}: FetchCurrentPriceArgs) => {
  const [price, setPrice] = useState<number | null>(0);

  useEffect(() => {
    if (!contractAddress) return;

    const getPrice = async () => {
      try {
        const currentPrice = await fetchCurrentPrice({
          contractAddress,
          chainId,
          conversionDenomination,
        });
        setPrice(currentPrice);
      } catch {
        console.warn(`Failed to fetch current price for ${contractAddress}`);
      }
    };

    getPrice();
  }, [chainId, contractAddress, conversionDenomination]);

  return price;
};

export default useCurrency;
