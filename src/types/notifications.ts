import { type IRemoteNotification } from '@magicbell/react-headless';

export enum NotificationType {
  ExpenditureReadyForReview = 'ExpenditureReadyForReview',
  ExpenditureReadyForFunding = 'ExpenditureReadyForFunding',
  ExpenditureReadyForRelease = 'ExpenditureReadyForRelease',
  ExpenditureFinalized = 'ExpenditureFinalized',
  ExpenditureCancelled = 'ExpenditureCancelled',
  PermissionsAction = 'PermissionsAction',
  Mention = 'Mention',
}

export interface NotificationAttributes {
  colonyAddress?: string;
  creator?: string;
  notificationType?: NotificationType;
  transactionHash?: string;
  expenditureID?: string;
}

// Create our own notification type so that we have types for the custom attributes, instead of
//  the default Record<string, unknown> type given by magicbell.
export interface Notification
  extends Omit<IRemoteNotification, 'customAttributes'> {
  customAttributes?: NotificationAttributes;
}
