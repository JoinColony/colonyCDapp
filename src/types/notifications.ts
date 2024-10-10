import { type IRemoteNotification } from '@magicbell/react-headless';

export enum NotificationType {
  // Expenditures
  ExpenditureReadyForReview = 'ExpenditureReadyForReview',
  ExpenditureReadyForFunding = 'ExpenditureReadyForFunding',
  ExpenditureReadyForRelease = 'ExpenditureReadyForRelease',
  ExpenditureFinalized = 'ExpenditureFinalized',
  ExpenditureCancelled = 'ExpenditureCancelled',

  // Funds
  FundsClaimed = 'FundsClaimed',

  // Mentions
  Mention = 'Mention',

  // Multisig
  MultiSigActionCreated = 'MultiSigActionCreated',
  MultiSigActionFinalized = 'MultiSigActionFinalized',
  MultiSigActionApproved = 'MultiSigActionApproved',
  MultiSigActionRejected = 'MultiSigActionRejected',

  // Actions made with permissions
  PermissionsAction = 'PermissionsAction',

  // Extensions
  ExtensionInstalled = 'ExtensionInstalled',
  ExtensionUpgraded = 'ExtensionUpgraded',
  ExtensionEnabled = 'ExtensionEnabled',
  ExtensionDeprecated = 'ExtensionDeprecated',
  ExtensionUninstalled = 'ExtensionUninstalled',
}

export interface NotificationAttributes {
  colonyAddress?: string;
  creator?: string;
  notificationType?: NotificationType;
  transactionHash?: string;
  expenditureID?: string;
  tokenAmount?: string;
  tokenAddress?: string;
  extensionHash?: string;
}

// Create our own notification type so that we have types for the custom attributes, instead of
//  the default Record<string, unknown> type given by magicbell.
export interface Notification
  extends Omit<IRemoteNotification, 'customAttributes'> {
  customAttributes?: NotificationAttributes;
}
