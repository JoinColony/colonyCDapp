module.exports = {
  getColony: /* GraphQL */ `
    query GetColony($address: ID!) {
      getColony(id: $address) {
        chainMetadata {
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
            nativeFundingPotId
            nativeSkillId
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
              chainMetadata {
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
