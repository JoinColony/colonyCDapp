module.exports = {
  getUserByAddress: /* GraphQL */ `
    query GetUser($id: ID!) {
      getUser(id: $id) {
        bridgeCustomerId
      }
    }
  `,
  updateUser: /* GraphQL */ `
    mutation UpdateUser(
      $input: UpdateUserInput!
      $condition: ModelUserConditionInput
    ) {
      updateUser(input: $input, condition: $condition) {
        id
      }
    }
  `,
};
