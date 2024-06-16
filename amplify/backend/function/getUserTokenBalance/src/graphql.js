module.exports = {
  getUserStakesInColony: /* GraphQL */ `
    query GetUserStakesInColony($userAddress: ID!, $colonyAddress: ID!) {
      getUserStakes(
        userAddress: $userAddress
        filter: {
          colonyAddress: { eq: $colonyAddress }
          isClaimed: { ne: true }
        }
        limit: 10000
      ) {
        items {
          amount
        }
      }
    }
  `,
};
