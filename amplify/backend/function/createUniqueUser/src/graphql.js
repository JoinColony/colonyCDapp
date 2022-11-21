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
        profileId
        profile {
          id
          avatar
          thumbnail
          displayName
          bio
          location
          website
          email
          meta {
            emailPermissions
          }
        }
        watchlist {
          nextToken
        }
        createdAt
        updatedAt
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
