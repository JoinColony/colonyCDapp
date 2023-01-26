module.exports = {
  getExtension: /* GraphQL */ `
    query GetExtension($colonyId: ID!, $hash: String!) {
      getExtensionByColonyAndHash(
        colonyId: $colonyId
        hash: { eq: $hash }
        filter: { isDeleted: { eq: false } }
      ) {
        items {
          id
        }
      }
    }
  `,
  updateExtension: /* GraphQL */ `
    mutation UpdateExtension($input: UpdateColonyExtensionInput!) {
      updateColonyExtension(input: $input) {
        id
        colonyId
        hash
        installedBy
        installedAt
        isDeprecated
        isDeleted
        isInitialized
        version
      }
    }
  `,
  createExtension: /* GraphQL */ `
    mutation CreateExtension($input: CreateColonyExtensionInput!) {
      createColonyExtension(input: $input) {
        id
        colonyId
        hash
        installedBy
        installedAt
        isDeprecated
        isDeleted
        isInitialized
        version
      }
    }
  `,
};
