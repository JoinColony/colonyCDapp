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
          recovery
          nativeToken {
            mintable
            unlockable
            unlocked
          }
        }
        meta {
          chainId
          network
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

export const getCurrentUser = /* GraphQL */ `
  query GetCurrentUser($address: ID!) {
    getUserByAddress(id: $address) {
      items {
        profile {
          avatar
          bio
          displayName
          email
          location
          thumbnail
          website
        }
        walletAddress: id
        name
        watchlist {
          items {
            colony {
              colonyAddress: id
              name
              profile {
                displayName
                thumbnail
              }
              meta {
                chainId
                network
              }
            }
            createdAt
          }
        }
      }
    }
  }
`;
