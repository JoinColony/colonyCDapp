module.exports = {
  getUserByAddress: /* GraphQL */ `
    query GetUser($id: ID!) {
      getUserByAddress(id: $id) {
        items {
          id
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
    query GetWatchersInColony($id: ID!, $domainId: ID!) {
      getColonyByAddress(id: $id) {
        items {
          watchers {
            items {
              user {
                id
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
                roles(filter: { domainId: { eq: $domainId } }) {
                  items {
                    role_0
                    role_1
                    role_2
                    role_3
                    role_5
                    role_6
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
};
