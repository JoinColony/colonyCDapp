import { useEffect, useState } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetColonyTokenLockedStateLazyQuery } from '~gql';

const useTokenLockStates = (): Record<string, boolean> => {
  const {
    colony: { tokens },
  } = useColonyContext();
  const [getColonyTokenLockedState] = useGetColonyTokenLockedStateLazyQuery();
  const [tokenLockStatesMap, setTokenLockStatesMap] = useState({});

  const fetchTokenStates = async () => {
    if (!tokens) {
      return;
    }

    const newTokenLockStatesMap = {};

    const tokenStates = await Promise.all(
      tokens.items.map(async (t) => {
        if (!t) return undefined;

        const { data } = await getColonyTokenLockedState({
          variables: { nativeTokenId: t.token.tokenAddress },
        });

        const lockState =
          data?.getColoniesByNativeTokenId?.items[0]?.status?.nativeToken
            ?.unlocked;

        return lockState;
      }),
    );

    tokens.items.forEach((t, i) => {
      if (!t || tokenStates[i] === undefined || tokenStates[i] === null) return;
      newTokenLockStatesMap[t.token.tokenAddress] = tokenStates[i];
    });

    setTokenLockStatesMap(newTokenLockStatesMap);
  };

  useEffect(() => {
    fetchTokenStates();
  }, []);

  return tokenLockStatesMap;
};

export default useTokenLockStates;
