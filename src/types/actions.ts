import { type ColonyRole } from '@colony/colony-js';

import { type ColonyActionType } from './graphql.ts';

export enum ColonyAndExtensionsEvents {
  Generic = 'Generic',
  /*
   * Colony Events
   */
  ColonyFundsMovedBetweenFundingPots = 'ColonyFundsMovedBetweenFundingPots',
  FundingPotAdded = 'FundingPotAdded',
  PaymentAdded = 'PaymentAdded',
  PayoutClaimed = 'PayoutClaimed',
  TokenUnlocked = 'TokenUnlocked',
  TokensMinted = 'TokensMinted',
  SkillAdded = 'SkillAdded',
  DecisionCreated = 'DecisionCreated',
  DomainAdded = 'DomainAdded',
  DomainMetadata = 'DomainMetadata',
  PaymentPayoutSet = 'PaymentPayoutSet',
  ColonyUpgraded = 'ColonyUpgraded',
  ColonyMetadata = 'ColonyMetadata',
  ColonyInitialised = 'ColonyInitialised',
  ColonyBootstrapped = 'ColonyBootstrapped',
  ColonyFundsClaimed = 'ColonyFundsClaimed',
  ColonyRoleSet = 'ColonyRoleSet',
  RewardPayoutCycleStarted = 'RewardPayoutCycleStarted',
  RewardPayoutCycleEnded = 'RewardPayoutCycleEnded',
  RewardPayoutClaimed = 'RewardPayoutClaimed',
  ColonyRewardInverseSet = 'ColonyRewardInverseSet',
  ExpenditureAdded = 'ExpenditureAdded',
  ExpenditureTransferred = 'ExpenditureTransferred',
  ExpenditureCancelled = 'ExpenditureCancelled',
  ExpenditureFinalized = 'ExpenditureFinalized',
  ExpenditureRecipientSet = 'ExpenditureRecipientSet',
  ExpenditureSkillSet = 'ExpenditureSkillSet',
  ExpenditurePayoutSet = 'ExpenditurePayoutSet',
  Annotation = 'Annotation',
  PaymentSkillSet = 'PaymentSkillSet',
  PaymentRecipientSet = 'PaymentRecipientSet',
  PaymentFinalized = 'PaymentFinalized',
  TokensBurned = 'TokensBurned',
  ArbitraryReputationUpdate = 'ArbitraryReputationUpdate',
  /*
   * Network events
   */
  ColonyNetworkInitialised = 'ColonyNetworkInitialised',
  TokenLockingAddressSet = 'TokenLockingAddressSet',
  MiningCycleResolverSet = 'MiningCycleResolverSet',
  NetworkFeeInverseSet = 'NetworkFeeInverseSet',
  TokenWhitelisted = 'TokenWhitelisted',
  ColonyVersionAdded = 'ColonyVersionAdded',
  MetaColonyCreated = 'MetaColonyCreated',
  ColonyAdded = 'ColonyAdded',
  AuctionCreated = 'AuctionCreated',
  ReputationMiningInitialised = 'ReputationMiningInitialised',
  ReputationMiningCycleComplete = 'ReputationMiningCycleComplete',
  ReputationRootHashSet = 'ReputationRootHashSet',
  UserLabelRegistered = 'UserLabelRegistered',
  ColonyLabelRegistered = 'ColonyLabelRegistered',
  ReputationMinerPenalised = 'ReputationMinerPenalised',
  ExtensionAddedToNetwork = 'ExtensionAddedToNetwork',
  ExtensionInstalled = 'ExtensionInstalled',
  ExtensionInitialised = 'ExtensionInitialised',
  ExtensionUpgraded = 'ExtensionUpgraded',
  ExtensionDeprecated = 'ExtensionDeprecated',
  ExtensionUninstalled = 'ExtensionUninstalled',
  RecoveryRoleSet = 'RecoveryRoleSet',
  RecoveryModeEntered = 'RecoveryModeEntered',
  RecoveryModeExited = 'RecoveryModeExited',
  RecoveryStorageSlotSet = 'RecoveryStorageSlotSet',
  RecoveryModeExitApproved = 'RecoveryModeExitApproved',
  /*
   * Token events
   */
  Mint = 'Mint',
  Burn = 'Burn',
  LogSetAuthority = 'LogSetAuthority',
  LogSetOwner = 'LogSetOwner',
  Approval = 'Approval',
  Transfer = 'Transfer',
  Unlock = 'Unlock',
  /*
   * Extension: One Tx Payment events
   */
  OneTxPaymentMade = 'OneTxPaymentMade',
  /*
   * Extension: Coin Machine events
   */
  TokensBought = 'TokensBought',
  PeriodUpdated = 'PeriodUpdated',
  /*
   * Motion events
   */
  MotionCreated = 'MotionCreated',
  MotionStaked = 'MotionStaked',
  MotionVoteSubmitted = 'MotionVoteSubmitted',
  MotionVoteRevealed = 'MotionVoteRevealed',
  MotionFinalized = 'MotionFinalized',
  MotionEscalated = 'MotionEscalated',
  MotionRewardClaimed = 'MotionRewardClaimed',
  MotionEventSet = 'MotionEventSet',
  ObjectionRaised = 'ObjectionRaised',
  /*
   * Extension: Whitelist events
   */
  UserApproved = 'UserApproved',
  AgreementSigned = 'AgreementSigned',
  /*
   * Safe events
   */
  SafeAdded = 'SafeAdded',
  SafeRemoved = 'SafeRemoved',
  // NOTE: these differ to allow easy mapping from the
  // schema types to the action types
  SafeTransferFunds = 'SAFE_TRANSFER_FUNDS',
  SafeRawTransaction = 'SAFE_RAW_TRANSACTION',
  SafeTransferNft = 'SAFE_TRANSFER_NFT',
  SafeContractInteraction = 'SAFE_CONTRACT_INTERACTION',
  SafeMultipleTransactions = 'SAFE_MULTIPLE_TRANSACTIONS',
}

export type ActionUserRoles = {
  id: ColonyRole;
  setTo: boolean;
};

export enum ExtendedColonyActionType {
  /**
   * @deprecated
   * This is still needed to allow users to view existing Colony Objective actions
   */
  UpdateColonyObjective = 'UPDATE_COLONY_OBJECTIVE',
  RemoveSafe = 'REMOVE_SAFE',
  AddSafe = 'ADD_SAFE',
  SafeTransferFunds = 'SAFE_TRANSFER_FUNDS',
  SafeRawTransaction = 'SAFE_RAW_TRANSACTION',
  SafeTransferNft = 'SAFE_TRANSFER_NFT',
  SafeContractInteraction = 'SAFE_CONTRACT_INTERACTION',
  SafeMultipleTransactions = 'SAFE_MULTIPLE_TRANSACTIONS',
  SafeTransferFundsMotion = 'SAFE_TRANSFER_FUNDS_MOTION',
  SafeRawTransactionMotion = 'SAFE_RAW_TRANSACTION_MOTION',
  SafeTransferNftMotion = 'SAFE_TRANSFER_NFT_MOTION',
  SafeContractInteractionMotion = 'SAFE_CONTRACT_INTERACTION_MOTION',
  SafeMultipleTransactionsMotion = 'SAFE_MULTIPLE_TRANSACTIONS_MOTION',
  UpdateColonyObjectiveMotion = 'UPDATE_COLONY_OBJECTIVE_MOTION',
  UpdateColonyObjectiveMultisig = 'UPDATE_COLONY_OBJECTIVE_MULTISIG',
  SplitPayment = 'SPLIT_PAYMENT',
}

/**
 * Union covering all contract-recognised and extended actions and motions types
 */
export type AnyActionType = ColonyActionType | ExtendedColonyActionType;

/*
 * This list will get longer once we add more system events to the dapp
 */
export enum SystemMessages {
  EnoughExitRecoveryApprovals = 'EnoughExitRecoveryApprovals',
  MotionHasPassed = 'MotionHasPassed',
  MotionHasFailedNotFinalizable = 'MotionHasFailedNotFinalizable',
  MotionHasFailedFinalizable = 'MotionHasFailedFinalizable',
  MotionRevealPhase = 'MotionRevealPhase',
  MotionVotingPhase = 'MotionVotingPhase',
  MotionFullyStaked = 'MotionFullyStaked',
  MotionFullyStakedAfterObjection = 'MotionFullyStakedAfterObjection',
  ObjectionFullyStaked = 'ObjectionFullyStaked',
  MotionRevealResultObjectionWon = 'MotionRevealResultObjectionWon',
  MotionRevealResultMotionWon = 'MotionRevealResultMotionWon',
  MotionCanBeEscalated = 'MotionCanBeEscalated',
}

export enum DecisionMethod {
  Permissions = 'Permissions',
  Reputation = 'Reputation',
  MultiSig = 'MultiSig',
}
