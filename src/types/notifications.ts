import { type IRemoteNotification } from '@magicbell/react-headless';

export enum NotificationType {
  ExpenditureReadyForReview = 'ExpenditureReadyForReview',
  ExpenditureReadyForFunding = 'ExpenditureReadyForFunding',
  ExpenditureReadyForRelease = 'ExpenditureReadyForRelease',
  ExpenditureFinalized = 'ExpenditureFinalized',
  ExpenditureCancelled = 'ExpenditureCancelled',
  PermissionsAction = 'PermissionsAction',
  Mention = 'Mention',
  ExtensionInstalled = 'ExtensionInstalled',
  ExtensionUpgraded = 'ExtensionUpgraded',
  ExtensionEnabled = 'ExtensionEnabled',
  ExtensionDeprecated = 'ExtensionDeprecated',
  ExtensionUninstalled = 'ExtensionUninstalled',
  ExtensionSettingsChanged = 'ExtensionSettingsChanged',
}

export interface NotificationAttributes {
  colonyAddress?: string;
  creator?: string;
  notificationType?: NotificationType;
  transactionHash?: string;
  expenditureID?: string;
  extensionHash?: string;
}

// Create our own notification type so that we have types for the custom attributes, instead of
//  the default Record<string, unknown> type given by magicbell.
export interface Notification
  extends Omit<IRemoteNotification, 'customAttributes'> {
  customAttributes?: NotificationAttributes;
}
