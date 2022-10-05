/* tslint:disable */
/* eslint-disable */

export const createColonyWithToken = /* GraphQL */ `
  mutation CreateColonyWithToken(
    $colonyAddress: ID!
    $colonyName: String!
    $tokenAddress: ID!
    $tokenName: String!
    $tokenSymbol: String!
    $tokenDecimals: Int = 18
    $tokenType: TokenType = COLONY
  ) {
    createToken(
      input: {
        decimals: $tokenDecimals,
        id: $tokenAddress,
        name: $tokenName,
        symbol: $tokenSymbol
        type: $tokenType
      }
    ) {
      id
    }
    createColony(
      input: {
        id: $colonyAddress,
        name: $colonyName,
        colonyNativeTokenId: $tokenAddress,
      }
    ) {
      id
    }
    createColonyTokens(
      input: {
        tokenID: $tokenAddress,
        colonyID: $colonyAddress,
      }
    ) {
      id
    }
  }
`;
