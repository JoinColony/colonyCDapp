module.exports = {
  getColony: /* GraphQL */ `
    query GetColony($address: ID!) {
      getColony(id: $address) {
        version
      }
    }
  `,
  getProxyColonies: /* GraphQL */ `
    query GetProxyColonies($colonyAddress: ID!) {
      getProxyColoniesByColonyAddress(colonyAddress: $colonyAddress) {
        items {
          chainId
          isActive
        }
      }
    }
  `,
};
