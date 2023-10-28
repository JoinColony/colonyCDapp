import { createIntl } from '@formatjs/intl';

import { getParams } from '../../getParams';
import { graphqlRequest } from '../../utils';

import {
  GetDisplayName_SnDocument,
  GetDisplayName_SnQuery,
  GetDisplayName_SnQueryVariables,
  NotificationBuilderParams,
  NotificationType,
} from './types';

const messageSetup = async () => {
  try {
    const [apiKey, graphqlURL] = await getParams([
      'appsyncApiKey',
      'graphqlUrl',
    ]);

    return {
      apiKey,
      graphqlURL,
    };
  } catch (e) {
    throw new Error(`Unable to get environment variables. Reason: ${e}`);
  }
};

export const notificationBuilder = async ({
  type,
  associatedUserId,
  associatedActionId,
  customNotificationText,
}: NotificationBuilderParams) => {
  const { apiKey, graphqlURL } = await messageSetup();

  const displayNameQuery = await graphqlRequest<
    GetDisplayName_SnQuery,
    GetDisplayName_SnQueryVariables
  >(
    GetDisplayName_SnDocument,
    { id: associatedUserId || '' },
    graphqlURL,
    apiKey,
  );

  if (displayNameQuery.errors || !displayNameQuery.data) {
    const [error] = displayNameQuery.errors;
    throw new Error(error || 'Could not fetch user name data from DynamoDB');
  }

  const associatedUserDisplayName =
    displayNameQuery?.data?.getProfile?.displayName || associatedUserId;

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
      return customNotificationText || '';
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

/**
 * Helper function to remove interpolation markers from a string.
 * Colony name and actions are associated with their blockchain hash this is signified in the message save to the db
 * with square brackets eg. [<colony-name-example>]. However this signification has no meaning when the notification
 * is sent via the web notifications service so this helper function strips these interpolation markers.
 */
export const removeInterpolationMarkers = (message: string) => {
  return message.replace(/[\[\]]/g, '');
};
