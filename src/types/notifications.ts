import { type IRemoteNotification } from '@magicbell/react-headless';

export enum NotificationType {
  Action = 'Action',
  Mention = 'Mention',
}

export interface NotificationAttributes {
  colonyAddress?: string;
  creator?: string;
  notificationType?: NotificationType;
  transactionHash?: string;
}

// Create our own notification type so that we have types for the custom attributes, instead of
//  the default Record<string, unknown> type given by magicbell.
export interface Notification
  extends Omit<IRemoteNotification, 'customAttributes'> {
  customAttributes?: NotificationAttributes;
}
