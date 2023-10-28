module.exports = {
  getProfile: /* GraphQL */ `
    query GetProfile($id: ID!) {
      getProfile(id: $id) {
        notificationSettings {
          notificationTokens
        }
        email
      }
    }
  `,
  updateContributorNotificationSettings: /* GraphQL */ `
    mutation UpdateColonyContributor($input: UpdateColonyContributorInput!) {
      updateColonyContributor(input: $input) {
        id
      }
    }
  `,
};
