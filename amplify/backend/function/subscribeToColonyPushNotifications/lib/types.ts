import { SubscribeColonyPushNotificationInput } from '../../../../../src/graphql/generated';

export {
  UpdateColonyContributorMutation,
  UpdateColonyContributorMutationVariables,
  UpdateColonyContributorDocument,
  GetProfile_StcpnQuery,
  GetProfile_StcpnQueryVariables,
  GetProfile_StcpnDocument,
} from '../../../../../src/graphql/generated';

export interface TriggerEvent {
  arguments: {
    input: SubscribeColonyPushNotificationInput;
  };
}
