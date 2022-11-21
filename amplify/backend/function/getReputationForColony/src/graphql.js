module.exports = {
  getColonyByAddress: /* GraphQL */ `
    query getColonyByAddress($id: ID!) {
      getColonyByAddress(id: $id) {
        items {
          id
          name
          domains {
            items {
              id
            }
          }
          watchers {
            items {
              id
            }
          }
        }
      }
    }
  `,
  listWatchedColonies: /* GraphQL */ `
    query ListWatchedColonies(
      $filter: ModelWatchedColoniesFilterInput
      $limit: Int
      $nextToken: String
    ) {
      listWatchedColonies(
        filter: $filter
        limit: $limit
        nextToken: $nextToken
      ) {
        items {
          id
          colonyID
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  `,
  createColony: /* GraphQL */ `
    mutation CreateColony(
      $input: CreateColonyInput!
      $condition: ModelColonyConditionInput
    ) {
      createColony(input: $input, condition: $condition) {
        id
        name
        nativeToken {
          id
          name
          symbol
          decimals
          type
          createdAt
          updatedAt
        }
        tokens {
          nextToken
        }
        profile {
          avatar
          thumbnail
          displayName
          bio
          location
          website
          email
        }
        status {
          recovery
          deployed
        }
        domains {
          nextToken
        }
        watchers {
          nextToken
        }
        createdAt
        updatedAt
        colonyNativeTokenId
        type
      }
    }
  `,
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
};
