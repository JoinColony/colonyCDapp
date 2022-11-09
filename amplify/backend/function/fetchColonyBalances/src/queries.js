module.exports = {
  getColony: /* GraphQL */ `
    query GetColony($address: ID!) {
      getColony(id: $address) {
        meta {
          chainId
          network
        }
        domains {
          items {
            colonyDomainsId
            color
            createdAt
            description
            domainParentId
            id
            name
            nativeId
            updatedAt
            parent {
              colonyDomainsId
              color
              createdAt
              description
              domainParentId
              id
              name
              nativeId
              updatedAt
            }
          }
        }
        tokens {
          items {
            token {
              createdAt
              decimals
              id
              meta {
                chainId
                network
              }
              name
              symbol
              type
              updatedAt
            }
          }
        }
      }
    }
  `,
};
