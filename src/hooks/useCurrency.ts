import { useEffect, useState } from 'react';

import { Network, SupportedCurrencies } from '~gql';
import { fetchCurrentPrice } from '~utils/currency/currency';
import { FetchCurrentPriceArgs } from '~utils/currency/types';

const useCurrency = ({
  contractAddress,
  chainId = Network.Gnosis,
  conversionDenomination = SupportedCurrencies.Usd,
}: FetchCurrentPriceArgs) => {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (!contractAddress) return;

    const getPrice = async () => {
      const currentPrice = await fetchCurrentPrice({
        contractAddress,
        chainId,
        conversionDenomination,
      });
      setPrice(currentPrice);
    };

    getPrice();
  }, [chainId, contractAddress, conversionDenomination]);

  return price;
};

export default useCurrency;
