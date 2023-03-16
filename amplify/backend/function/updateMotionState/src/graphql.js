module.exports = {
  updateColonyAction: /* GraphQL */ `
    mutation UpdateColonyAction($input: UpdateColonyActionInput!) {
      updateColonyAction(input: $input) {
        id
        colonyId
        type
        blockNumber
        initiatorAddress
        initiatorUser {
          profile {
            avatar
            bio
            displayName
            email
            location
            thumbnail
            website
          }
          id
          name
          watchlist {
            items {
              colony {
                id
                name
                profile {
                  avatar
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
        recipientAddress
        recipient {
          profile {
            avatar
            bio
            displayName
            email
            location
            thumbnail
            website
          }
          id
          name
          watchlist {
            items {
              colony {
                id
                name
                profile {
                  avatar
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
        amount
        tokenAddress
        token {
          decimals
          id
          name
          symbol
          type
          avatar
          thumbnail
        }
        fromDomain {
          id
          nativeId
          isRoot
          nativeFundingPotId
          metadata {
            name
            color
            description
            changelog {
              transactionHash
              oldName
              newName
              oldColor
              newColor
              oldDescription
              newDescription
            }
          }
        }
        toDomain {
          id
          nativeId
          isRoot
          nativeFundingPotId
          metadata {
            name
            color
            description
            changelog {
              transactionHash
              oldName
              newName
              oldColor
              newColor
              oldDescription
              newDescription
            }
          }
        }
        createdAt
        colony {
          id
        }
        isMotion
        motionData {
          motionDomainId
          motionStakes {
            raw {
              yay
              nay
            }
            percentage {
              yay
              nay
            }
          }
          usersStakes {
            address
            stakes {
              raw {
                yay
                nay
              }
            }
          }
          stakerRewards {
            address
            rewards {
              raw {
                yay
                nay
              }
            }
          }
          motionState
          rootHash
          skillRep
          motionId
          isFinalized
          isClaimed
        }
      }
    }
  `,
  getColonyAction: /* GraphQL */ `
    query GetColonyAction($id: ID!) {
      getColonyAction(id: $id) {
        id
        colonyId
        type
        blockNumber
        initiatorAddress
        initiatorUser {
          profile {
            avatar
            bio
            displayName
            email
            location
            thumbnail
            website
          }
          id
          name
          watchlist {
            items {
              colony {
                id
                name
                profile {
                  avatar
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
        recipientAddress
        recipient {
          profile {
            avatar
            bio
            displayName
            email
            location
            thumbnail
            website
          }
          id
          name
          watchlist {
            items {
              colony {
                id
                name
                profile {
                  avatar
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
        amount
        tokenAddress
        token {
          decimals
          id
          name
          symbol
          type
          avatar
          thumbnail
        }
        fromDomain {
          id
          nativeId
          isRoot
          nativeFundingPotId
          metadata {
            name
            color
            description
            changelog {
              transactionHash
              oldName
              newName
              oldColor
              newColor
              oldDescription
              newDescription
            }
          }
        }
        toDomain {
          id
          nativeId
          isRoot
          nativeFundingPotId
          metadata {
            name
            color
            description
            changelog {
              transactionHash
              oldName
              newName
              oldColor
              newColor
              oldDescription
              newDescription
            }
          }
        }
        createdAt
        colony {
          id
        }
        isMotion
        motionData {
          motionDomainId
          motionStakes {
            raw {
              yay
              nay
            }
            percentage {
              yay
              nay
            }
          }
          usersStakes {
            address
            stakes {
              raw {
                yay
                nay
              }
            }
          }
          stakerRewards {
            address
            rewards {
              raw {
                yay
                nay
              }
            }
          }
          motionState
          rootHash
          skillRep
          motionId
          isFinalized
          isClaimed
        }
      }
    }
  `,
};
