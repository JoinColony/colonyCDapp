import { useEffect, useState } from 'react';

import { Network, SupportedCurrencies } from '~gql';
import { fetchCurrentPrice, FetchCurrentPriceArgs } from '~utils/currency';

const useCurrency = ({
  contractAddress,
  chainId = Network.Gnosis,
  conversionDenomination = SupportedCurrencies.Usd,
}: FetchCurrentPriceArgs) => {
  const [price, setPrice] = useState<number | null>(0);

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
