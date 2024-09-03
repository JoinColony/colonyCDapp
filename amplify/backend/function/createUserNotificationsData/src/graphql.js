module.exports = {
  createNotificationsData: /* GraphQL */ `
    mutation CreateNotificationsData($input: CreateNotificationsDataInput!) {
      createNotificationsData(input: $input) {
        userAddress
      }
    }
  `,
};
