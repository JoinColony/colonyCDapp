/* eslint-disable no-underscore-dangle */
import { DEFAULT_NETWORK_TOKEN, ADDRESS_ZERO } from '~constants/index.ts';
import { TokenType } from '~gql';
import { type UnaliasedColonyTokensItem } from '~types/graphql.ts';
import { getNetworkByChainId } from '~utils/web3/index.ts';

const tokensFieldCache = {
  /*
   * @NOTE Add the local chain's native token to the colony's tokens list
   */
  tokens: {
    read: (baseTokens, { readField, cache }) => {
      if (baseTokens === undefined) return null;
      const cacheRepresentation = cache.extract();

      const proxyColonies = readField('proxyColonies');
      const chainMetadata = readField('chainMetadata');

      const { chainId: colonyChainId } = chainMetadata;

      const updatedTokens: UnaliasedColonyTokensItem[] = [
        {
          __typename: 'ColonyTokens',
          id: 'DEFAULT_TOKEN_ID',
          token: {
            __typename: 'Token',
            ...DEFAULT_NETWORK_TOKEN,
            id: ADDRESS_ZERO,
            avatar: null,
            thumbnail: null,
            type: TokenType.Colony,
            chainMetadata: {
              chainId: colonyChainId,
            },
          },
        },
      ];

      proxyColonies.items.forEach((proxyColony) => {
        if (!proxyColony.isActive) {
          return;
        }
        const { chainId } = proxyColony;

        const network = getNetworkByChainId(chainId);

        if (!network || !network.nativeToken) {
          return;
        }

        const token: UnaliasedColonyTokensItem = {
          __typename: 'ColonyTokens',
          id: `${chainId}_NATIVE_TOKEN_ID`,
          token: {
            __typename: 'Token',
            ...network.nativeToken,
            /*
             * This is aliased as "colonyTokensId" in the "ColonyTokensConnection" fragment,
             * but the cache only considers canonical field names. Therefore, to ensure type safety
             * when manually modifying the cache, we must use this custom type.
             */
            // @ts-ignore
            id: ADDRESS_ZERO,
            avatar: null,
            thumbnail: null,
            type: TokenType.Colony,
            chainMetadata: {
              chainId,
            },
          },
        };

        updatedTokens.push(token);
      });

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
