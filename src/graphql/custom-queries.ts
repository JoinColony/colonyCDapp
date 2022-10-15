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

export const getUserColonyWatchlist = /* GraphQL */ `
  query GetUserColonyWatchlist($address: ID!) {
    getUserByAddress(id: $address) {
      items {
        watchlist {
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
          }
        }
      }
    }
  }
`;
