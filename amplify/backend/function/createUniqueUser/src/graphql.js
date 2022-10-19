module.exports = {
  getUser: /* GraphQL */ `
    query GetUser($id: ID!, $name: String!) {
      getUserByAddress(id: $id) {
        items {
          id
          name
        }
      }
      getUserByName(name: $name) {
        items {
          id
          name
        }
      }
    }
  `,
  createUser: /* GraphQL */ `
    mutation CreateUser(
      $input: CreateUserInput!
      $condition: ModelUserConditionInput
    ) {
      createUser(input: $input, condition: $condition) {
        id
        name
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
        watchlist {
          nextToken
        }
        createdAt
        updatedAt
      }
    }
  `,
};
