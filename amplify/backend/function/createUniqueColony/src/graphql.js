module.exports = {
  getColony: /* GraphQL */ `
    query GetColony($id: ID!, $name: String!) {
      getColonyByAddress(id: $id) {
        items {
          id
          name
        }
      }
      getColonyByName(name: $name) {
        items {
          id
          name
        }
      }
      getColonyByType(type: METACOLONY) {
        items {
          id
          name
        }
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
