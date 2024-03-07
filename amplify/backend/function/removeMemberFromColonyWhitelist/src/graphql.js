module.exports = {
  updateColony: /* GraphQL */ `
    mutation UpdateColony($input: UpdateColonyInput!) {
      updateColony(input: $input) {
        id
        whitelist
      }
    }
  `,
  getUser: /* GraphQL */ `
    query GetUser($id: ID!) {
      getProfile(id: $id) {
        id
        displayName
      }
    }
  `,
  getColony: /* GraphQL */ `
    query GetColony($id: ID!) {
      getColony(id: $id) {
        id
        whitelist
      }
    }
  `,
};
