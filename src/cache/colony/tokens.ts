import { DEFAULT_NETWORK_TOKEN, ADDRESS_ZERO } from '~constants';
import { TokenType } from '~gql';
import { UnaliasedColonyTokensItem } from '~types';

const tokensFieldCache = {
  /*
   * @NOTE Add the local chain's native token to the colony's tokens list
   */
  tokens: {
    read: (baseTokens) => {
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
          },
        },
      ];

      return {
        ...baseTokens,
        items: [...baseTokens.items, ...updatedTokens],
      };
    },
  },
};

export default tokensFieldCache;
