import { useMemo, useState, useEffect } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type Address } from '~types/index.ts';

const useCurrentSelectedToken = () => {
  const {
    colony: { tokens, nativeToken },
  } = useColonyContext();
  const { tokenAddress: nativeTokenAddress } = nativeToken;

  const [currentTokenAddress, setCurrentTokenAddress] = useState<Address>();

  useEffect(() => {
    if (!nativeTokenAddress) {
      return;
    }

    setCurrentTokenAddress(nativeTokenAddress);
  }, [nativeTokenAddress]);

  const currentToken = useMemo(() => {
    if (tokens) {
      return tokens.items.find(
        (colonyToken) =>
          colonyToken?.token.tokenAddress === currentTokenAddress,
      );
    }
    return undefined;
  }, [tokens, currentTokenAddress]);

  return { currentToken, setCurrentTokenAddress };
};

export default useCurrentSelectedToken;
