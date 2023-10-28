const { createIntl } = require('@formatjs/intl');

const { graphqlRequest, NotificationType } = require('./utils');
const { getDisplayName } = require('./graphql');

const bodyBuilder = async (arguments) => {
  const {
    type,
    associatedUserId,
    associatedActionId,
    customNotificationText,
    graphqlURL,
    apiKey,
  } = arguments;

  const userNameQuery = await graphqlRequest(
    getDisplayName,
    { id: associatedUserId },
    graphqlURL,
    apiKey,
  );

  if (userNameQuery.errors || !userNameQuery.data) {
    const [error] = userNameQuery.errors;
    throw new Error(
      error?.message || 'Could not fetch user name data from DynamoDB',
    );
  }

  const associatedUserDisplayName =
    userNameQuery?.data?.getProfile?.displayName || associatedUserId;

  // TODO: Get a string the associated action. However this is a bit more tricky as
  // it is built complexly in the app see `getActionTitleValues.ts`

  // Create the `intl` object
  const intl = createIntl({
    // Locale of the application
    // This will eventually be fetched from the user profile settings
    locale: 'en',
    // Locale of the fallback defaultMessage
    defaultLocale: 'en',
  });

  switch (type) {
    case NotificationType.Assignment:
      return intl.formatMessage({
        id: 'assignment',
        defaultMessage: `[${associatedUserDisplayName}] assigned you to a task in Development team: [${associatedActionId}]`,
      });
    case NotificationType.Custom:
      return customNotificationText;
    case NotificationType.Mention:
      return intl.formatMessage({
        id: 'mention',
        defaultMessage: `[${associatedUserDisplayName}] has mentioned you in: [${associatedActionId}]`,
      });
    // When does this happen?
    case NotificationType.Ready:
      return intl.formatMessage({
        id: 'ready',
        defaultMessage: `Batch payment to 51 addresses by [${associatedUserDisplayName}] is ready to be released`,
      });
    default:
      throw new Error(`Notification type: ${type} is not defined`);
  }
};

const notificationBuilder = async (arguments) => {
  const { colonyName } = arguments;

  try {
    const body = await bodyBuilder(arguments);

    return {
      title: colonyName,
      body,
    };
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  notificationBuilder,
};
