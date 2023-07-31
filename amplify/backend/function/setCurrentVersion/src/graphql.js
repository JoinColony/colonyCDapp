module.exports = {
  getCurrentVersion: /* GraphQL */ `
    query GetCurrentVersion($key: String!) {
      getCurrentVersionByKey(key: $key) {
        items {
          id
        }
      }
    }
  `,
  createCurrentVersion: /* GraphQL */ `
    mutation CreateCurrentVersion($input: CreateCurrentVersionInput!) {
      createCurrentVersion(input: $input) {
        id
      }
    }
  `,
  updateCurrentVersion: /* GraphQL */ `
    mutation UpdateCurrentVersion($input: UpdateCurrentVersionInput!) {
      updateCurrentVersion(input: $input) {
        id
      }
    }
  `,
};
