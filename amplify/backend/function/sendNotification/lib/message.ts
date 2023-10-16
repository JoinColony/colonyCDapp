import { createIntl } from '@formatjs/intl';

import { graphqlRequest } from '../../utils';

import {
  GetDisplayName_SnDocument,
  GetDisplayName_SnQuery,
  GetDisplayName_SnQueryVariables,
  NotificationType,
  Params,
} from './types';

export const notificationBuilder = async (params: Params): Promise<string> => {
  const {
    type,
    associatedUserId,
    associatedActionId,
    customNotificationText,
    graphqlURL,
    apiKey,
  } = params;

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
