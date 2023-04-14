module.exports = {
  getUserReputation: /* GraphQL */ `
    query GetUserReputation($input: GetUserReputationInput!) {
      getUserReputation(input: $input)
    }
  `,
};
