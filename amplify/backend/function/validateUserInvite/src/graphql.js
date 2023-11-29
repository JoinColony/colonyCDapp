module.exports = {
  getColonyMemberInvite: /* GraphQL */ `
    query GetColonyMemberInvite($colonyAddress: ID!) {
      getColonyByAddress(id: $colonyAddress) {
        items {
          colonyMemberInvite {
            id
            invitesRemaining
            valid
          }
          whitelist
        }
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
  updateColonyMemberInvite: /* GraphQL */ `
    mutation UpdateColonyMemberInvite($input: UpdateColonyMemberInviteInput!) {
      updateColonyMemberInvite(input: $input) {
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
  getUser: /* GraphQL */ `
    query GetUser($id: ID!, $name: String!) {
      getProfile(id: $id) {
        id
        displayName
      }
      getProfileByUsername(displayName: $name) {
        items {
          id
          displayName
        }
      }
    }
  `,
  getColonyContributor: /* GraphQL */ `
    query GetColonyContributor($id: ID!) {
      getColonyContributor(id: $id) {
        id
      }
    }
  `,
};
