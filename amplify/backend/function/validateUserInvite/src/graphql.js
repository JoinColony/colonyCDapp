module.exports = {
  getColonyMemberInvite: /* GraphQL */ `
    query GetColonyMemberInvite($inviteCode: ID!) {
      getColonyMemberInvite(id: $inviteCode) {
        invitesRemaining
        colonyId
        colony {
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
    query GetUser($id: ID!) {
      getProfile(id: $id) {
        id
        displayName
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
