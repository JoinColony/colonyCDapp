import { ColonyRole } from '@colony/colony-js';

import { ListItemStatus } from '~shared/ListItem';

import { Address, ColonyActionType } from './index';
import { ColonyMotions } from './motions';

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
}

export type ActionUserRoles = {
  id: ColonyRole;
  setTo: boolean;
};

export interface FormattedEvent {
  id: string;
  status?: ListItemStatus;
  eventName: ColonyAndExtensionsEvents;
  colonyAddress: Address;
  agent: Address | null;
  recipient: Address;
  transactionHash: string;
  createdAt: Date;
  displayValues: string;
  domainId: string;
  newDomainId: string;
  fundingPot?: string;
  metadata?: string;
  tokenAddress?: string | null;
  paymentId?: string;
  decimals: number;
  amount: string;
  role: ColonyRole;
  setTo: boolean;
  extensionHash?: string;
  extensionVersion?: string;
  oldVersion?: string;
  newVersion?: string;
  storageSlot?: string;
  storageSlotValue?: string;
  motionId?: string;
  vote?: string;
  whiteListStatus?: boolean;
  activePeriod?: string;
  currentPeriod?: string;
}

export type ActionItemType = ColonyActionType | ColonyMotions;

/*
 * This list will get longer once we add more system events to the dapp
 */
export enum SystemMessagesName {
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
