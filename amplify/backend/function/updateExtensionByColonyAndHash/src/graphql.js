const extensionFragment = /* GraphQL */ `
  fragment Extension on ColonyExtension {
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
`;

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
    ${extensionFragment}
    mutation UpdateExtension($input: UpdateColonyExtensionInput!) {
      updateColonyExtension(input: $input) {
        ...Extension
      }
    }
  `,
  createExtension: /* GraphQL */ `
    ${extensionFragment}
    mutation CreateExtension($input: CreateColonyExtensionInput!) {
      createColonyExtension(input: $input) {
        ...Extension
      }
    }
  `,
};
