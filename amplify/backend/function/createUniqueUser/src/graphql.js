module.exports = {
  getUser: /* GraphQL */ `
    query GetUser($id: ID!, $name: String!) {
      getProfile(id: $id) {
        id
        displayName
      }
      getProfileByUsername(displayName: $name) {
        items {
          id
          displayName
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
