export const getUser = `
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
  `;

export const getDisplayName = `
    query GetUserName($id: ID!) {
      getProfile(id: $id) {
        displayName
      }
    }
  `;

export const getColonyName = `
    query GetColonyName($id: ID!) {
      getColony(id: $id) {
        name
        metadata {
          displayName
        }
      }
    }
  `;

export const getColonyContributors = `
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
  `;

export const createUserNotification = `
    mutation CreateNotification($input: CreateNotificationInput!) {
      createNotification(input: $input) {

        id
      }
    }
  `;
