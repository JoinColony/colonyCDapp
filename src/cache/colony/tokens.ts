import { DEFAULT_NETWORK_TOKEN, ADDRESS_ZERO } from '~constants';
import { TokenType } from '~gql';

const tokensFieldCache = {
  /*
   * @NOTE Add the local's chain native token to the colony's tokens list
   */
  tokens: {
    read: (baseTokens) => ({
      ...baseTokens,
      items: [
        ...baseTokens.items,
        {
          __typename: 'ColonyTokens',
          token: {
            __typename: 'Token',
            ...DEFAULT_NETWORK_TOKEN,
            id: ADDRESS_ZERO,
            avatar: null,
            thumbnail: null,
            tokenAdress: ADDRESS_ZERO,
            type: TokenType.Colony,
          },
        },
      ],
    }),
  },
};

export default tokensFieldCache;
