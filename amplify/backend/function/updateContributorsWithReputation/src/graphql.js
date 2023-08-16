module.exports = {
  getContributorWithReputation: /* GraphQL */ `
    query GetContributorWithReputation($id: ID!) {
      getContributorWithReputation(id: $id) {
        createdAt
      }
    }
  `,
  updateContributorWithReputation: /* GraphQL */ `
    mutation UpdateContributorWithReputation(
      $id: ID!
      $reputation: String!
      $domainReputationPercentage: String!
      $colonyReputationPercentage: String!
      $type: ContributorType
    ) {
      updateContributorWithReputation(
        input: {
          id: $id
          reputation: $reputation
          domainReputationPercentage: $domainReputationPercentage
          colonyReputationPercentage: $colonyReputationPercentage
          type: $type
        }
      ) {
        id
      }
    }
  `,
  createContributorWithReputation: /* GraphQL */ `
    mutation createContributorWithReputation(
      $input: CreateContributorWithReputationInput!
    ) {
      createContributorWithReputation(input: $input) {
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
