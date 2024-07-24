import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type Token, useGetColonyTokensWithLockedStatesQuery } from '~gql';

const useTokenLockStates = (): Record<string, boolean> => {
  const {
    colony: { name },
  } = useColonyContext();
  const { data } = useGetColonyTokensWithLockedStatesQuery({
    variables: { name },
  });

  const tokenStatusMap = useMemo(() => {
    if (!data) return {};

    const tokens = data?.getColonyByName?.items?.[0]?.tokens?.items.flatMap(
      (token) => token?.token,
    );

    return (tokens || []).reduce(
      (map: Record<string, boolean>, token: Token) => {
        if (!token) {
          return map;
        }

        const colony = token.colonies?.items.find(
          (colonyTokens) => colonyTokens?.colony.nativeTokenId === token.id,
        );

        if (!colony) {
          return map;
        }

        return {
          ...map,
          [token.id]: !!colony.colony.status?.nativeToken?.unlocked,
        };
      },
      {},
    );
  }, [data]);

  return tokenStatusMap;
};

export default useTokenLockStates;
