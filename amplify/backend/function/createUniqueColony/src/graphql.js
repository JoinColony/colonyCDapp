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
      }
    }
  `,
  getTokenByAddress: /* GraphQL */ `
    query GetTokenByAddress(
      $id: ID!
      $sortDirection: ModelSortDirection
      $filter: ModelTokenFilterInput
      $limit: Int
    ) {
      getTokenByAddress(
        id: $id
        sortDirection: $sortDirection
        filter: $filter
        limit: $limit
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
      }
    }
  `,
  createProfile: /* GraphQL */ `
    mutation CreateProfile(
      $input: CreateProfileInput!
      $condition: ModelProfileConditionInput
    ) {
      createProfile(input: $input, condition: $condition) {
        id
      }
    } 
  `,
};
