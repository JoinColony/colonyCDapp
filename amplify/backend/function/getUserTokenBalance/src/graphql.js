module.exports = {
  getColonyStake: /* GraphQL */ `
    query GetColonyStake($colonyStakeId: ID!) {
      getColonyStake(id: $colonyStakeId) {
        totalAmount
      }
    }
  `,
};
