module.exports = {
  getUser: /* GraphQL */ `
    query GetUser($id: ID!) {
      getUserByAddress(id: $id) {
        items {
          id
          name
          profileId
          profile {
            avatar
            thumbnail
            displayName
            bio
            location
            website
            email
          }
        }
      }
    }
  `,
  getWatchersInColony: /* GraphQL */ `
    query GetWatchersInColony($id: ID!) {
      getColonyByAddress(id: $id) {
        items {
          watchers {
            items {
              user {
                id
                name
                createdAt
                profileId
                profile {
                  avatar
                  bio
                  displayName
                  email
                  location
                  thumbnail
                  website
                }
              }
            }
          }
        }
      }
    }
  `,
};
