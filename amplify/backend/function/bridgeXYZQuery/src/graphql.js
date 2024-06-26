module.exports = {
  getUser: /* GraphQL */ `
    query GetUser($id: ID!) {
      getUser(id: $id) {
        bridgeCustomerId
      }
    }
  `,
};
