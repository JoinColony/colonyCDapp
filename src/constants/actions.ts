import { ColonyRole } from '@colony/colony-js';

// @TODO: For ManagePermissionsInSubDomain it should be possible to use
// EITHER Architecture OR Root so this (and all functions that use it) will need refactoring
// to have an array of acceptable permissions be like this: [[ColonyRole.Architecture], [ColonyRole.Root]]
export const PERMISSIONS_NEEDED_FOR_ACTION = {
  // Simple Payment requires both funding and administration roles
  SimplePayment: [ColonyRole.Funding, ColonyRole.Administration],
  MintTokens: [ColonyRole.Root],
  TransferFunds: [ColonyRole.Root],
  UnlockToken: [ColonyRole.Root],
  ManageTokens: [ColonyRole.Root],
  CreateNewTeam: [ColonyRole.Architecture],
  EditExistingTeam: [ColonyRole.Architecture],
  // Manage Reputation requires a different role dependant on awarding / removing
  ManageReputationAward: [ColonyRole.Root],
  ManageReputationRemove: [ColonyRole.Arbitration],
  // Manage Permissions requires the root role if assigning the root role
  ManagePermissionsInRootDomain: [ColonyRole.Root],
  // All other permissions can be assigned with the Architecture role
  // @TODO: This should be possible to use EITHER architecture OR root
  // Make sure to update the saga too when this is updated
  ManagePermissionsInSubDomain: [ColonyRole.Architecture],
  ManageVerifiedMembers: [ColonyRole.Root],
  EditColonyDetails: [ColonyRole.Root],
  ManageColonyObjective: [ColonyRole.Root],
  UpgradeColonyVersion: [ColonyRole.Root],
  EnterRecoveryMode: [ColonyRole.Root],
  PaymentBuilder: [ColonyRole.Administration],
  Decision: [ColonyRole.Administration],
};

export enum Action {
  SimplePayment = 'simple-payment',
  PaymentBuilder = 'payment-builder',
  BatchPayment = 'batch-payment',
  SplitPayment = 'split-payment',
  StagedPayment = 'staged-payment',
  StreamingPayment = 'streaming-payment',
  CreateDecision = 'create-decision',
  TransferFunds = 'transfer-funds',
  MintTokens = 'mint-tokens',
  UnlockToken = 'unlock-token',
  ManageTokens = 'manage-tokens',
  CreateNewTeam = 'create-new-team',
  EditExistingTeam = 'edit-existing-team',
  ManageReputation = 'manage-reputation',
  ManagePermissions = 'manage-permissions',
  EditColonyDetails = 'edit-colony-details',
  UpgradeColonyVersion = 'upgrade-colony-version',
  EnterRecoveryMode = 'enter-recovery-mode',
  CreateNewIntegration = 'create-new-integration',
  ManageColonyObjectives = 'manage-colony-objectives',
  UserPermissions = 'user-permissions',
  SimpleDiscussion = 'simple-discussion',
  ManageVerifiedMembers = 'manage-verified-members',
}
