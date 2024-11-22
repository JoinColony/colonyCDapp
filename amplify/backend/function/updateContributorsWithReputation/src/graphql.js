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
            nativeSkillId
            isRoot
          }
        }
        lastUpdatedContributorsWithReputation
      }
    }
  `,
  updateColony: /* GraphQL */ `
    mutation UpdateColony($input: UpdateColonyInput!) {
      updateColony(input: $input) {
        id
      }
    }
  `,
  getReputationMiningCycleMetadata: /* GraphQL */ `
    query GetReputationMiningCycleMetadata($id: ID!) {
      getReputationMiningCycleMetadata(id: $id) {
        lastCompletedAt
      }
    }
  `,
  updateDomain: /* GraphQL */ `
    mutation UpdateDomain($input: UpdateDomainInput!) {
      updateDomain(input: $input) {
        id
      }
    }
  `,
};
