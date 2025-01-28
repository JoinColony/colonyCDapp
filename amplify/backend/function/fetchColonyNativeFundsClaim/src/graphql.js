module.exports = {
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
