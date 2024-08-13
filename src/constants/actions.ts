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
  /**
   * @deprecated
   * This is still being used by our filters context for some components to filter by Colony Objectives Action type
   */
  ManageColonyObjectives = 'manage-colony-objectives',
  UserPermissions = 'user-permissions',
  SimpleDiscussion = 'simple-discussion',
  ManageVerifiedMembers = 'manage-verified-members',
}
