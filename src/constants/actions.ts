import { ColonyRole } from '@colony/colony-js';

import { ColonyActionType } from '~gql';

// Expected to return ColonyRole[][]
export const PERMISSIONS_NEEDED_FOR_ACTION = {
  // Simple Payment requires all of funding, arbitration and administration roles
  SimplePayment: [
    [ColonyRole.Funding, ColonyRole.Arbitration, ColonyRole.Administration],
  ],
  MintTokens: [[ColonyRole.Root]],
  TransferFunds: [[ColonyRole.Funding]],
  UnlockToken: [[ColonyRole.Root]],
  ManageTokens: [[ColonyRole.Root]],
  CreateNewTeam: [[ColonyRole.Architecture]],
  EditExistingTeam: [[ColonyRole.Architecture]],
  // Manage Reputation requires a different role dependant on awarding / removing
  ManageReputationAward: [[ColonyRole.Root]],
  ManageReputationRemove: [[ColonyRole.Arbitration]],
  // If assigning permissions in the root domain, the root role is required
  ManagePermissionsInRootDomain: [[ColonyRole.Root]],
  // If assigning permissions in any other domain, root or architecture is required
  ManagePermissionsInSubDomain: [[ColonyRole.Root], [ColonyRole.Architecture]],
  // Except when using multi-sig, then the architecture role is required
  ManagePermissionsInSubDomainViaMultiSig: [[ColonyRole.Architecture]],
  ManageVerifiedMembers: [[ColonyRole.Root]],
  EditColonyDetails: [[ColonyRole.Root]],
  ManageColonyObjective: [[ColonyRole.Root]],
  UpgradeColonyVersion: [[ColonyRole.Root]],
  EnterRecoveryMode: [[ColonyRole.Root]],
  PaymentBuilder: [[ColonyRole.Administration]],
  SplitPayment: [[ColonyRole.Administration]],
  StagedPayment: [[ColonyRole.Administration]],
  ArbitraryTxs: [[ColonyRole.Root]],
  ManageSupportedChains: [[ColonyRole.Root]],
};

export enum Action {
  ArbitraryTxs = 'arbitrary-txs',
  PaymentGroup = 'payment-group',
  SimplePayment = 'simple-payment',
  PaymentBuilder = 'payment-builder',
  BatchPayment = 'batch-payment',
  SplitPayment = 'split-payment',
  StagedPayment = 'staged-payment',
  StreamingPayment = 'streaming-payment',
  ManageColony = 'manage-colony',
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
  /**
   * @deprecated
   * This is still being used by our filters context for some components to filter by Colony Objectives Action type
   */
  ManageColonyObjectives = 'manage-colony-objectives',
  UserPermissions = 'user-permissions',
  SimpleDiscussion = 'simple-discussion',
  ManageVerifiedMembers = 'manage-verified-members',
  ManageSupportedChains = 'manage-supported-chains',
}

export const ACTIONS_WITH_NETWORK_FEE = new Set([
  ColonyActionType.Payment,
  ColonyActionType.PaymentMotion,
  ColonyActionType.PaymentMultisig,
  ColonyActionType.MultiplePayment,
  ColonyActionType.MultiplePaymentMotion,
  ColonyActionType.MultiplePaymentMultisig,
]);
