/* eslint-disable no-underscore-dangle */
import { DEFAULT_NETWORK_TOKEN, ADDRESS_ZERO } from '~constants/index.ts';
import { TokenType } from '~gql';
import { type UnaliasedColonyTokensItem } from '~types/graphql.ts';

const tokensFieldCache = {
  /*
   * @NOTE Add the local chain's native token to the colony's tokens list
   */
  tokens: {
    read: (baseTokens, { cache }) => {
      if (baseTokens === undefined) return null;
      const cacheRepresentation = cache.extract();

      const updatedTokens: UnaliasedColonyTokensItem[] = [
        {
          __typename: 'ColonyTokens',
          id: 'DEFAULT_TOKEN_ID',
          token: {
            __typename: 'Token',
            ...DEFAULT_NETWORK_TOKEN,
            tokenAddress: ADDRESS_ZERO,
            avatar: null,
            thumbnail: null,
            type: TokenType.Colony,
          },
        },
      ];

      const colonyTokensResolved = baseTokens.items.map((colonyToken) => {
        // If it's a reference object, we need to look it up in the cache, same for the token nested object
        if (colonyToken.__ref) {
          const colonyTokenInCache = cacheRepresentation[colonyToken.__ref];

          return {
            ...colonyTokenInCache,
            token: colonyTokenInCache.token?.__ref
              ? cacheRepresentation[colonyTokenInCache.token.__ref]
              : colonyToken.token,
          };
        }

        return colonyToken;
      });

      return {
        ...baseTokens,
        items: [...colonyTokensResolved, ...updatedTokens],
      };
    },
  },
};

export default tokensFieldCache;
