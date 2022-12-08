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
        isDeprecated
        isDeleted
        isInitialized
        version
      }
    }
  `,
};
