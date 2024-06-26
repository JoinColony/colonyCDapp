module.exports = {
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
