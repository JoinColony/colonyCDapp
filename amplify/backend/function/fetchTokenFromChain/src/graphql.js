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
          avatar
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
  getColonyByAddress: /* GraphQL */ `
    query GetColonyByAddress($address: ID!) {
      getColonyByAddress(id: $address) {
        items {
          id
        }
      }
    }
  `,
  getUserByAddress: /* GraphQL */ `
    query GetUserByAddress($address: ID!) {
      getUserByAddress(id: $address) {
        items {
          id
        }
      }
    }
  `,
};
