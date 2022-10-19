module.exports = {
  listDomains: /* GraphQL */ `
    query ListDomains($colonyAddress: ID!) {
      listDomains(filter: { colonyDomainsId: { eq: $colonyAddress } }) {
        items {
          nativeId
        }
      }
    }
  `,
  createDomain: /* GraphQL */ `
    mutation CreateDomain($input: CreateDomainInput!) {
      createDomain(input: $input) {
        id
        nativeId
        name
        description
        color
        parent {
          id
          nativeId
          name
          description
          color
          createdAt
          updatedAt
          colonyDomainsId
          domainParentId
        }
        createdAt
        updatedAt
        colonyDomainsId
        domainParentId
      }
    }
  `,
};
