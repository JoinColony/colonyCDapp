import { SendNotificationInput } from '../../../../../src/graphql/generated';

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

export interface TriggerEvent {
  arguments: {
    input: SendNotificationInput;
  };
}

type MessageComponents = {
  title: string;
  body: string;
};

export type NotificationBuilderParams = Pick<
  SendNotificationInput,
  'type' | 'associatedUserId' | 'associatedActionId' | 'customNotificationText'
>;

export type SendMessageToUserParams = Pick<
  SendNotificationInput,
  'type' | 'userId'
> &
  MessageComponents;

export type CreateNotificationInDatabaseParams = Pick<
  SendNotificationInput,
  'colonyId' | 'userId'
> &
  MessageComponents;

export type BroadcastToColonyParams = Pick<SendNotificationInput, 'colonyId'> &
  MessageComponents;
