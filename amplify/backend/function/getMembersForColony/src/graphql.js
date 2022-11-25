module.exports = {
  getUser: /* GraphQL */ `
    query GetUser($id: ID!) {
      getUserByAddress(id: $id) {
        items {
          id
          name
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
