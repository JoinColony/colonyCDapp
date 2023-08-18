module.exports = {
  getColonyContributor: /* GraphQL */ `
    query GetColonyContributor($id: ID!) {
      getColonyContributor(id: $id) {
        id
      }
    }
  `,
  updateColonyContributor: /* GraphQL */ `
    mutation UpdateColonyContributor($input: UpdateColonyContributorInput!) {
      updateColonyContributor(input: $input) {
        id
      }
    }
  `,
  createColonyContributor: /* GraphQL */ `
    mutation CreateColonyContributor($input: CreateColonyContributorInput!) {
      createColonyContributor(input: $input) {
        id
      }
    }
  `,
  getContributorReputation: /* GraphQL */ `
    query GetContributorReputation($id: ID!) {
      getContributorReputation(id: $id) {
        createdAt
      }
    }
  `,
  createContributorReputation: /* GraphQL */ `
    mutation CreateContributorReputation(
      $input: CreateContributorReputationInput!
    ) {
      createContributorReputation(input: $input) {
        id
      }
    }
  `,
  updateContributorReputation: /* GraphQL */ `
    mutation UpdateContributorReputation(
      $input: UpdateContributorReputationInput!
    ) {
      updateContributorReputation(input: $input) {
        id
      }
    }
  `,
  getColony: /* GraphQL */ `
    query GetColony($colonyAddress: ID!) {
      getColony(id: $colonyAddress) {
        domains {
          items {
            nativeId
          }
        }
        lastUpdatedContributorsWithReputation
      }
    }
  `,
  updateColony: /* GraphQL */ `
    mutation UpdateColony($colonyAddress: ID!, $date: AWSDateTime!) {
      updateColony(
        input: {
          id: $colonyAddress
          lastUpdatedContributorsWithReputation: $date
        }
      ) {
        id
      }
    }
  `,
};
