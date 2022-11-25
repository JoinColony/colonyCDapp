module.exports = {
  getExtension: /* GraphQL */ `
    query GetExtension($colonyId: ID!, $hash: String!) {
      getExtensionByColonyAndHash(
        colonyId: $colonyId
        hash: { eq: $hash }
        filter: { status: { ne: DELETED } }
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
        status
      }
    }
  `,
};
