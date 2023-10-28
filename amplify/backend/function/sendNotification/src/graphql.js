module.exports = {
  getUser: /* GraphQL */ `
    query GetUserDetails($id: ID!) {
      getProfile(id: $id) {
        displayName
        email
        notificationSettings {
          notificationTokens
          enableEmail
          enableMention
          enableAssign
        }
      }
    }
  `,
  getDisplayName: /* GraphQL */ `
    query GetUserName($id: ID!) {
      getProfile(id: $id) {
        displayName
      }
    }
  `,
  getColonyName: /* GraphQL */ `
    query GetColonyName($id: ID!) {
      getColony(id: $id) {
        name
        metadata {
          displayName
        }
      }
    }
  `,
  getColonyContributors: /* GraphQL */ `
    query GetColonyContributors($colonyAddress: ID!) {
      getContributorsByColony(colonyAddress: $colonyAddress) {
        items {
          notificationSettings {
            enablePush
            enableEmail
            enableActions
            enableDecisions
          }
          user {
            profile {
              id
              displayName
              email
            }
          }
        }
      }
    }
  `,
  createUserNotification: /* GraphQL */ `
    mutation CreateNotification($input: CreateNotificationInput!) {
      createNotification(input: $input) {
        id
      }
    }
  `,
};
