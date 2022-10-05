module.exports = {
  getTokenByAddress: /* GraphQL */ `
    query GetTokenByAddress(
      $id: ID!
      $sortDirection: ModelSortDirection
      $filter: ModelTokenFilterInput
      $limit: Int
      $nextToken: String
    ) {
      getTokenByAddress(
        id: $id
        sortDirection: $sortDirection
        filter: $filter
        limit: $limit
        nextToken: $nextToken
      ) {
        items {
          id
          name
          symbol
          decimals
          type
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  `,
  createToken: /* GraphQL */ `
    mutation CreateToken(
      $input: CreateTokenInput!
      $condition: ModelTokenConditionInput
    ) {
      createToken(input: $input, condition: $condition) {
        id
        name
        symbol
        decimals
        type
        colonies {
          nextToken
        }
        createdAt
        updatedAt
      }
    }
  `,
};
