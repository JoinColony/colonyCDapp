module.exports = {
  getUserMotionStakes: /* GraphQL */ `
    query GetUserMotionStakes($userAddress: ID!, $colonyAddress: ID!) {
      getUserStakes(
        userAddress: $userAddress
        filter: {
          colonyAddress: { eq: $colonyAddress }
          isClaimed: { ne: true }
          type: { eq: MOTION }
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
