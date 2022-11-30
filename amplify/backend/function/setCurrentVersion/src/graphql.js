module.exports = {
  getCurrentVersion: /* GraphQL */ `
    query GetCurrentVersion($item: CurrentVersionItem!) {
      getCurrentVersionByItem(item: $item) {
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
