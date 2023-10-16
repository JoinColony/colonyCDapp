import type { messaging } from 'firebase-admin';

import { SendNotificationInput } from '../../../../../src/graphql/generated';
import { ReplaceInputMaybe, DeepOmit } from '../../utils';

export {
  NotificationType,
  GetDisplayName_SnQuery,
  GetDisplayName_SnQueryVariables,
  GetDisplayName_SnDocument,
  GetUserDetails_SnQuery,
  GetUserDetails_SnQueryVariables,
  GetUserDetails_SnDocument,
  GetColonyName_SnQuery,
  GetColonyName_SnQueryVariables,
  GetColonyName_SnDocument,
  CreateNotification_SnMutation,
  CreateNotification_SnMutationVariables,
  CreateNotification_SnDocument,
  GetColonyContributors_SnQuery,
  GetColonyContributors_SnQueryVariables,
  GetColonyContributors_SnDocument,
} from '../../../../../src/graphql/generated';

export type Params = {
  graphqlURL: string;
  apiKey: string;
  mailJetApiKey: string;
  mailJetApiSecret: string;
  messaging?: messaging.Messaging;
  title?: string;
  body?: string;
  userEmail?: string;
  userName?: string;
} & SendNotificationInput;

export interface TriggerEvent {
  arguments: {
    input: SendNotificationInput;
  };
}
