/* tslint:disable */
/* eslint-disable */

export const getFullColonyByName = /* GraphQL */ `
  query GetFullColonyByName($name: String!) {
    getColonyByName(name: $name) {
      items {
        colonyAddress: id
        name
        nativeToken {
          decimals
          tokenAddress: id
          name
          symbol
          type
        }
        profile {
          avatar
          bio
          displayName
          email
          location
          thumbnail
          website
        }
        status {
          deployed
          recovery
          nativeToken {
            mintable
            unlockable
            unlocked
          }
        }
        tokens {
          items {
            token {
              decimals
              tokenAddress: id
              name
              symbol
              type
            }
          }
        }
        domains {
          items {
            color
            description
            id
            name
            nativeId
            parentId: domainParentId
          }
        }
        watchers {
          items {
            user {
              walletAddress: id
              name
              profile {
                avatar
                bio
                displayName
                email
                location
                website
                thumbnail
              }
            }
          }
        }
      }
    }
  }
`;

export const getWatchlist = /* GraphQL */ `
  query GetWatchlist($address: ID!) {
    listWatchedColonies(filter: { userID: { eq: $address } }) {
      items {
        colony {
          colonyAddress: id
          name
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
        createdAt
      }
    }
  }
`;

export const getMetacolony = /* GraphQL */ `
  query GetMetacolony {
    getColonyByType(type: METACOLONY) {
      items {
        colonyAddress: id
        name
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
`;
