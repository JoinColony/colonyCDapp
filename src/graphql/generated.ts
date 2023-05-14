import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  AWSDate: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  AWSDateTime: string;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  AWSEmail: string;
  /** The AWSIPAddress scalar type represents a valid IPv4 or IPv6 address string. */
  AWSIPAddress: any;
  /** The AWSJSON scalar type represents a valid json object serialized as a string. */
  AWSJSON: any;
  /** AWSPhone */
  AWSPhone: any;
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  AWSTime: any;
  /** The AWSTimestamp scalar type represents the number of seconds that have elapsed since 1970-01-01T00:00Z. Timestamps are serialized and deserialized as numbers. Negative values are also accepted and these represent the number of seconds till 1970-01-01T00:00Z. */
  AWSTimestamp: any;
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  AWSURL: string;
};

export type ChainMetadata = {
  __typename?: 'ChainMetadata';
  blockNumber?: Maybe<Scalars['Int']>;
  chainId?: Maybe<Scalars['Int']>;
  logIndex?: Maybe<Scalars['Int']>;
  network?: Maybe<Network>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type ChainMetadataInput = {
  blockNumber?: InputMaybe<Scalars['Int']>;
  chainId?: InputMaybe<Scalars['Int']>;
  logIndex?: InputMaybe<Scalars['Int']>;
  network?: InputMaybe<Network>;
  transactionHash?: InputMaybe<Scalars['String']>;
};

export type Colony = {
  __typename?: 'Colony';
  actions?: Maybe<ModelColonyActionConnection>;
  balances?: Maybe<ColonyBalances>;
  chainFundsClaim?: Maybe<ColonyChainFundsClaim>;
  chainMetadata?: Maybe<ChainMetadata>;
  colonyNativeTokenId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  domains?: Maybe<ModelDomainConnection>;
  extensions?: Maybe<ModelColonyExtensionConnection>;
  fundsClaims?: Maybe<ModelColonyFundsClaimConnection>;
  id: Scalars['ID'];
  metadata?: Maybe<ColonyMetadata>;
  name: Scalars['String'];
  nativeToken: Token;
  status?: Maybe<ColonyStatus>;
  tokens?: Maybe<ModelColonyTokensConnection>;
  type?: Maybe<ColonyType>;
  updatedAt: Scalars['AWSDateTime'];
  version: Scalars['Int'];
  watchers?: Maybe<ModelWatchedColoniesConnection>;
};


export type ColonyActionsArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type ColonyDomainsArgs = {
  filter?: InputMaybe<ModelDomainFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type ColonyExtensionsArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type ColonyFundsClaimsArgs = {
  filter?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type ColonyTokensArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type ColonyWatchersArgs = {
  filter?: InputMaybe<ModelWatchedColoniesFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type ColonyAction = {
  __typename?: 'ColonyAction';
  amount?: Maybe<Scalars['String']>;
  blockNumber: Scalars['Int'];
  colony: Colony;
  colonyActionsId?: Maybe<Scalars['ID']>;
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  fromDomain?: Maybe<Domain>;
  fromDomainId?: Maybe<Scalars['ID']>;
  fundamentalChainId?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  initiatorAddress: Scalars['ID'];
  initiatorColony?: Maybe<Colony>;
  initiatorExtension?: Maybe<ColonyExtension>;
  initiatorUser?: Maybe<User>;
  isMotion?: Maybe<Scalars['Boolean']>;
  motionData?: Maybe<MotionData>;
  newColonyVersion?: Maybe<Scalars['Int']>;
  pendingColonyMetadata?: Maybe<ColonyMetadata>;
  pendingColonyMetadataId?: Maybe<Scalars['ID']>;
  pendingDomainMetadata?: Maybe<DomainMetadata>;
  pendingDomainMetadataId?: Maybe<Scalars['ID']>;
  recipient?: Maybe<User>;
  recipientAddress?: Maybe<Scalars['ID']>;
  showInActionsList: Scalars['Boolean'];
  toDomain?: Maybe<Domain>;
  toDomainId?: Maybe<Scalars['ID']>;
  token?: Maybe<Token>;
  tokenAddress?: Maybe<Scalars['ID']>;
  type: ColonyActionType;
  updatedAt: Scalars['AWSDateTime'];
};

export enum ColonyActionType {
  ColonyEdit = 'COLONY_EDIT',
  ColonyEditMotion = 'COLONY_EDIT_MOTION',
  CreateDomain = 'CREATE_DOMAIN',
  CreateDomainMotion = 'CREATE_DOMAIN_MOTION',
  EditDomain = 'EDIT_DOMAIN',
  EditDomainMotion = 'EDIT_DOMAIN_MOTION',
  EmitDomainReputationPenalty = 'EMIT_DOMAIN_REPUTATION_PENALTY',
  EmitDomainReputationPenaltyMotion = 'EMIT_DOMAIN_REPUTATION_PENALTY_MOTION',
  EmitDomainReputationReward = 'EMIT_DOMAIN_REPUTATION_REWARD',
  EmitDomainReputationRewardMotion = 'EMIT_DOMAIN_REPUTATION_REWARD_MOTION',
  Generic = 'GENERIC',
  MintTokens = 'MINT_TOKENS',
  MintTokensMotion = 'MINT_TOKENS_MOTION',
  MoveFunds = 'MOVE_FUNDS',
  MoveFundsMotion = 'MOVE_FUNDS_MOTION',
  NullMotion = 'NULL_MOTION',
  Payment = 'PAYMENT',
  PaymentMotion = 'PAYMENT_MOTION',
  Recovery = 'RECOVERY',
  SetUserRoles = 'SET_USER_ROLES',
  SetUserRolesMotion = 'SET_USER_ROLES_MOTION',
  UnlockToken = 'UNLOCK_TOKEN',
  UnlockTokenMotion = 'UNLOCK_TOKEN_MOTION',
  VersionUpgrade = 'VERSION_UPGRADE',
  VersionUpgradeMotion = 'VERSION_UPGRADE_MOTION',
  WrongColony = 'WRONG_COLONY'
}

export type ColonyBalance = {
  __typename?: 'ColonyBalance';
  balance: Scalars['String'];
  domain: Domain;
  id: Scalars['ID'];
  token: Token;
};

export type ColonyBalanceInput = {
  balance: Scalars['String'];
  domain: DomainInput;
  id?: InputMaybe<Scalars['ID']>;
  token: TokenInput;
};

export type ColonyBalances = {
  __typename?: 'ColonyBalances';
  items?: Maybe<Array<Maybe<ColonyBalance>>>;
};

export type ColonyBalancesInput = {
  items?: InputMaybe<Array<InputMaybe<ColonyBalanceInput>>>;
};

export type ColonyChainFundsClaim = {
  __typename?: 'ColonyChainFundsClaim';
  amount: Scalars['String'];
  createdAt: Scalars['AWSDateTime'];
  createdAtBlock: Scalars['Int'];
  id: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
};

export type ColonyChainFundsClaimInput = {
  amount: Scalars['String'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdAtBlock: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
};

export type ColonyExtension = {
  __typename?: 'ColonyExtension';
  colony: Colony;
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  installedAt: Scalars['AWSTimestamp'];
  installedBy: Scalars['String'];
  isDeleted: Scalars['Boolean'];
  isDeprecated: Scalars['Boolean'];
  isInitialized: Scalars['Boolean'];
  params?: Maybe<ExtensionParams>;
  updatedAt: Scalars['AWSDateTime'];
  version: Scalars['Int'];
};

export type ColonyFundsClaim = {
  __typename?: 'ColonyFundsClaim';
  amount: Scalars['String'];
  colonyFundsClaimTokenId: Scalars['ID'];
  colonyFundsClaimsId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  createdAtBlock: Scalars['Int'];
  id: Scalars['ID'];
  token: Token;
  updatedAt: Scalars['AWSDateTime'];
};

export type ColonyId = {
  __typename?: 'ColonyID';
  id: Scalars['ID'];
};

export type ColonyMetadata = {
  __typename?: 'ColonyMetadata';
  avatar?: Maybe<Scalars['String']>;
  changelog?: Maybe<Array<ColonyMetadataChangelog>>;
  createdAt: Scalars['AWSDateTime'];
  displayName: Scalars['String'];
  id: Scalars['ID'];
  isWhitelistActivated?: Maybe<Scalars['Boolean']>;
  modifiedTokenAddresses?: Maybe<PendingModifiedTokenAddresses>;
  thumbnail?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
  whitelistedAddresses?: Maybe<Array<Scalars['String']>>;
};

export type ColonyMetadataChangelog = {
  __typename?: 'ColonyMetadataChangelog';
  hasAvatarChanged: Scalars['Boolean'];
  hasWhitelistChanged: Scalars['Boolean'];
  haveTokensChanged: Scalars['Boolean'];
  newDisplayName: Scalars['String'];
  oldDisplayName: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type ColonyMetadataChangelogInput = {
  hasAvatarChanged: Scalars['Boolean'];
  hasWhitelistChanged: Scalars['Boolean'];
  haveTokensChanged: Scalars['Boolean'];
  newDisplayName: Scalars['String'];
  oldDisplayName: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type ColonyStatus = {
  __typename?: 'ColonyStatus';
  nativeToken?: Maybe<NativeTokenStatus>;
  recovery?: Maybe<Scalars['Boolean']>;
};

export type ColonyStatusInput = {
  nativeToken?: InputMaybe<NativeTokenStatusInput>;
  recovery?: InputMaybe<Scalars['Boolean']>;
};

export type ColonyTokens = {
  __typename?: 'ColonyTokens';
  colony: Colony;
  colonyID: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  token: Token;
  tokenID: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
};

export enum ColonyType {
  Colony = 'COLONY',
  Metacolony = 'METACOLONY'
}

export type ContractEvent = {
  __typename?: 'ContractEvent';
  agent: Scalars['String'];
  chainMetadata: ChainMetadata;
  colony?: Maybe<Colony>;
  contractEventColonyId?: Maybe<Scalars['ID']>;
  contractEventDomainId?: Maybe<Scalars['ID']>;
  contractEventTokenId?: Maybe<Scalars['ID']>;
  contractEventUserId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  domain?: Maybe<Domain>;
  encodedArguments?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  signature: Scalars['String'];
  target: Scalars['String'];
  token?: Maybe<Token>;
  updatedAt: Scalars['AWSDateTime'];
  user?: Maybe<User>;
};

export type Contributor = {
  __typename?: 'Contributor';
  reputationAmount?: Maybe<Scalars['String']>;
  reputationPercentage?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type CreateColonyActionInput = {
  amount?: InputMaybe<Scalars['String']>;
  blockNumber: Scalars['Int'];
  colonyActionsId?: InputMaybe<Scalars['ID']>;
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  fromDomainId?: InputMaybe<Scalars['ID']>;
  fundamentalChainId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  initiatorAddress: Scalars['ID'];
  isMotion?: InputMaybe<Scalars['Boolean']>;
  motionData?: InputMaybe<MotionDataInput>;
  newColonyVersion?: InputMaybe<Scalars['Int']>;
  pendingColonyMetadataId?: InputMaybe<Scalars['ID']>;
  pendingDomainMetadataId?: InputMaybe<Scalars['ID']>;
  recipientAddress?: InputMaybe<Scalars['ID']>;
  showInActionsList: Scalars['Boolean'];
  toDomainId?: InputMaybe<Scalars['ID']>;
  tokenAddress?: InputMaybe<Scalars['ID']>;
  type: ColonyActionType;
};

export type CreateColonyExtensionInput = {
  colonyId: Scalars['ID'];
  hash: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  installedAt: Scalars['AWSTimestamp'];
  installedBy: Scalars['String'];
  isDeleted: Scalars['Boolean'];
  isDeprecated: Scalars['Boolean'];
  isInitialized: Scalars['Boolean'];
  params?: InputMaybe<ExtensionParamsInput>;
  version: Scalars['Int'];
};

export type CreateColonyFundsClaimInput = {
  amount: Scalars['String'];
  colonyFundsClaimTokenId: Scalars['ID'];
  colonyFundsClaimsId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdAtBlock: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
};

export type CreateColonyInput = {
  balances?: InputMaybe<ColonyBalancesInput>;
  chainFundsClaim?: InputMaybe<ColonyChainFundsClaimInput>;
  chainMetadata?: InputMaybe<ChainMetadataInput>;
  colonyNativeTokenId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version: Scalars['Int'];
};

export type CreateColonyMetadataInput = {
  avatar?: InputMaybe<Scalars['String']>;
  changelog?: InputMaybe<Array<ColonyMetadataChangelogInput>>;
  displayName: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  isWhitelistActivated?: InputMaybe<Scalars['Boolean']>;
  modifiedTokenAddresses?: InputMaybe<PendingModifiedTokenAddressesInput>;
  thumbnail?: InputMaybe<Scalars['String']>;
  whitelistedAddresses?: InputMaybe<Array<Scalars['String']>>;
};

export type CreateColonyTokensInput = {
  colonyID: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  tokenID: Scalars['ID'];
};

export type CreateContractEventInput = {
  agent: Scalars['String'];
  chainMetadata: ChainMetadataInput;
  contractEventColonyId?: InputMaybe<Scalars['ID']>;
  contractEventDomainId?: InputMaybe<Scalars['ID']>;
  contractEventTokenId?: InputMaybe<Scalars['ID']>;
  contractEventUserId?: InputMaybe<Scalars['ID']>;
  encodedArguments?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  signature: Scalars['String'];
  target: Scalars['String'];
};

export type CreateCurrentNetworkInverseFeeInput = {
  id?: InputMaybe<Scalars['ID']>;
  inverseFee: Scalars['String'];
};

export type CreateCurrentVersionInput = {
  id?: InputMaybe<Scalars['ID']>;
  key: Scalars['String'];
  version: Scalars['Int'];
};

export type CreateDomainInput = {
  colonyId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  isRoot: Scalars['Boolean'];
  nativeFundingPotId: Scalars['Int'];
  nativeId: Scalars['Int'];
  nativeSkillId: Scalars['Int'];
};

export type CreateDomainMetadataInput = {
  changelog?: InputMaybe<Array<DomainMetadataChangelogInput>>;
  color: DomainColor;
  description: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};

export type CreateMotionMessageInput = {
  amount?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  initiatorAddress: Scalars['ID'];
  messageKey: Scalars['String'];
  name: Scalars['String'];
  vote?: InputMaybe<Scalars['String']>;
};

export type CreateProfileInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  id?: InputMaybe<Scalars['ID']>;
  location?: InputMaybe<Scalars['String']>;
  meta?: InputMaybe<ProfileMetadataInput>;
  thumbnail?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['AWSURL']>;
};

export type CreateTokenInput = {
  avatar?: InputMaybe<Scalars['String']>;
  chainMetadata?: InputMaybe<ChainMetadataInput>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  decimals: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  symbol: Scalars['String'];
  thumbnail?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<TokenType>;
};

export type CreateUniqueColonyInput = {
  chainMetadata?: InputMaybe<ChainMetadataInput>;
  colonyNativeTokenId: Scalars['ID'];
  id: Scalars['ID'];
  name: Scalars['String'];
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version: Scalars['Int'];
};

export type CreateUniqueUserInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  profile?: InputMaybe<ProfileInput>;
};

export type CreateUserInput = {
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  profileId?: InputMaybe<Scalars['ID']>;
};

export type CreateUserTokensInput = {
  id?: InputMaybe<Scalars['ID']>;
  tokenID: Scalars['ID'];
  userID: Scalars['ID'];
};

export type CreateWatchedColoniesInput = {
  colonyID: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  userID: Scalars['ID'];
};

export type CurrentNetworkInverseFee = {
  __typename?: 'CurrentNetworkInverseFee';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  inverseFee: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

export type CurrentVersion = {
  __typename?: 'CurrentVersion';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  key: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  version: Scalars['Int'];
};

export type DeleteColonyActionInput = {
  id: Scalars['ID'];
};

export type DeleteColonyExtensionInput = {
  id: Scalars['ID'];
};

export type DeleteColonyFundsClaimInput = {
  id: Scalars['ID'];
};

export type DeleteColonyInput = {
  id: Scalars['ID'];
};

export type DeleteColonyMetadataInput = {
  id: Scalars['ID'];
};

export type DeleteColonyTokensInput = {
  id: Scalars['ID'];
};

export type DeleteContractEventInput = {
  id: Scalars['ID'];
};

export type DeleteCurrentNetworkInverseFeeInput = {
  id: Scalars['ID'];
};

export type DeleteCurrentVersionInput = {
  id: Scalars['ID'];
};

export type DeleteDomainInput = {
  id: Scalars['ID'];
};

export type DeleteDomainMetadataInput = {
  id: Scalars['ID'];
};

export type DeleteMotionMessageInput = {
  id: Scalars['ID'];
};

export type DeleteProfileInput = {
  id: Scalars['ID'];
};

export type DeleteTokenInput = {
  id: Scalars['ID'];
};

export type DeleteUserInput = {
  id: Scalars['ID'];
};

export type DeleteUserTokensInput = {
  id: Scalars['ID'];
};

export type DeleteWatchedColoniesInput = {
  id: Scalars['ID'];
};

export type Domain = {
  __typename?: 'Domain';
  colony: Colony;
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  isRoot: Scalars['Boolean'];
  metadata?: Maybe<DomainMetadata>;
  nativeFundingPotId: Scalars['Int'];
  nativeId: Scalars['Int'];
  nativeSkillId: Scalars['Int'];
  updatedAt: Scalars['AWSDateTime'];
};

export enum DomainColor {
  Aqua = 'AQUA',
  Black = 'BLACK',
  Blue = 'BLUE',
  BlueGrey = 'BLUE_GREY',
  EmeraldGreen = 'EMERALD_GREEN',
  Gold = 'GOLD',
  Green = 'GREEN',
  LightPink = 'LIGHT_PINK',
  Magenta = 'MAGENTA',
  Orange = 'ORANGE',
  Periwinkle = 'PERIWINKLE',
  Pink = 'PINK',
  Purple = 'PURPLE',
  PurpleGrey = 'PURPLE_GREY',
  Red = 'RED',
  Yellow = 'YELLOW'
}

export type DomainInput = {
  id: Scalars['ID'];
};

export type DomainMetadata = {
  __typename?: 'DomainMetadata';
  changelog?: Maybe<Array<DomainMetadataChangelog>>;
  color: DomainColor;
  createdAt: Scalars['AWSDateTime'];
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

export type DomainMetadataChangelog = {
  __typename?: 'DomainMetadataChangelog';
  newColor: DomainColor;
  newDescription: Scalars['String'];
  newName: Scalars['String'];
  oldColor: DomainColor;
  oldDescription: Scalars['String'];
  oldName: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type DomainMetadataChangelogInput = {
  newColor: DomainColor;
  newDescription: Scalars['String'];
  newName: Scalars['String'];
  oldColor: DomainColor;
  oldDescription: Scalars['String'];
  oldName: Scalars['String'];
  transactionHash: Scalars['String'];
};

export enum EmailPermissions {
  IsHuman = 'isHuman',
  SendNotifications = 'sendNotifications'
}

export type ExtensionParams = {
  __typename?: 'ExtensionParams';
  votingReputation?: Maybe<VotingReputationParams>;
};

export type ExtensionParamsInput = {
  votingReputation?: InputMaybe<VotingReputationParamsInput>;
};

export type GetMotionStateInput = {
  colonyAddress: Scalars['String'];
  transactionHash: Scalars['String'];
};

export type GetMotionTimeoutPeriodsInput = {
  colonyAddress: Scalars['String'];
  motionId: Scalars['String'];
};

export type GetMotionTimeoutPeriodsReturn = {
  __typename?: 'GetMotionTimeoutPeriodsReturn';
  timeLeftToEscalate: Scalars['String'];
  timeLeftToReveal: Scalars['String'];
  timeLeftToStake: Scalars['String'];
  timeLeftToVote: Scalars['String'];
};

export type GetReputationForTopDomainsInput = {
  colonyAddress: Scalars['String'];
  rootHash?: InputMaybe<Scalars['String']>;
  walletAddress: Scalars['String'];
};

export type GetReputationForTopDomainsReturn = {
  __typename?: 'GetReputationForTopDomainsReturn';
  items?: Maybe<Array<UserDomainReputation>>;
};

export type GetUserReputationInput = {
  colonyAddress: Scalars['String'];
  domainId?: InputMaybe<Scalars['Int']>;
  rootHash?: InputMaybe<Scalars['String']>;
  walletAddress: Scalars['String'];
};

export type GetUserTokenBalanceInput = {
  tokenAddress: Scalars['String'];
  walletAddress: Scalars['String'];
};

export type GetUserTokenBalanceReturn = {
  __typename?: 'GetUserTokenBalanceReturn';
  activeBalance?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['String']>;
  inactiveBalance?: Maybe<Scalars['String']>;
  lockedBalance?: Maybe<Scalars['String']>;
  pendingBalance?: Maybe<Scalars['String']>;
};

export type GetVoterRewardsInput = {
  colonyAddress: Scalars['String'];
  motionDomainId: Scalars['String'];
  motionId: Scalars['String'];
  rootHash: Scalars['String'];
  voterAddress: Scalars['String'];
};

export type MembersForColonyInput = {
  colonyAddress: Scalars['String'];
  domainId?: InputMaybe<Scalars['Int']>;
  rootHash?: InputMaybe<Scalars['String']>;
  sortingMethod?: InputMaybe<SortingMethod>;
};

export type MembersForColonyReturn = {
  __typename?: 'MembersForColonyReturn';
  contributors?: Maybe<Array<Contributor>>;
  watchers?: Maybe<Array<Watcher>>;
};

export enum ModelAttributeTypes {
  Null = '_null',
  Binary = 'binary',
  BinarySet = 'binarySet',
  Bool = 'bool',
  List = 'list',
  Map = 'map',
  Number = 'number',
  NumberSet = 'numberSet',
  String = 'string',
  StringSet = 'stringSet'
}

export type ModelBooleanInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  eq?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
};

export type ModelColonyActionConditionInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyActionConditionInput>>>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyActionsId?: InputMaybe<ModelIdInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  fromDomainId?: InputMaybe<ModelIdInput>;
  fundamentalChainId?: InputMaybe<ModelIntInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  isMotion?: InputMaybe<ModelBooleanInput>;
  newColonyVersion?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyActionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyActionConditionInput>>>;
  pendingColonyMetadataId?: InputMaybe<ModelIdInput>;
  pendingDomainMetadataId?: InputMaybe<ModelIdInput>;
  recipientAddress?: InputMaybe<ModelIdInput>;
  showInActionsList?: InputMaybe<ModelBooleanInput>;
  toDomainId?: InputMaybe<ModelIdInput>;
  tokenAddress?: InputMaybe<ModelIdInput>;
  type?: InputMaybe<ModelColonyActionTypeInput>;
};

export type ModelColonyActionConnection = {
  __typename?: 'ModelColonyActionConnection';
  items: Array<Maybe<ColonyAction>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyActionFilterInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyActionFilterInput>>>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyActionsId?: InputMaybe<ModelIdInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  fromDomainId?: InputMaybe<ModelIdInput>;
  fundamentalChainId?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  isMotion?: InputMaybe<ModelBooleanInput>;
  newColonyVersion?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyActionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyActionFilterInput>>>;
  pendingColonyMetadataId?: InputMaybe<ModelIdInput>;
  pendingDomainMetadataId?: InputMaybe<ModelIdInput>;
  recipientAddress?: InputMaybe<ModelIdInput>;
  showInActionsList?: InputMaybe<ModelBooleanInput>;
  toDomainId?: InputMaybe<ModelIdInput>;
  tokenAddress?: InputMaybe<ModelIdInput>;
  type?: InputMaybe<ModelColonyActionTypeInput>;
};

export type ModelColonyActionTypeInput = {
  eq?: InputMaybe<ColonyActionType>;
  ne?: InputMaybe<ColonyActionType>;
};

export type ModelColonyConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyConditionInput>>>;
  colonyNativeTokenId?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelColonyConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyConditionInput>>>;
  type?: InputMaybe<ModelColonyTypeInput>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelColonyConnection = {
  __typename?: 'ModelColonyConnection';
  items: Array<Maybe<Colony>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyExtensionConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyExtensionConditionInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  hash?: InputMaybe<ModelStringInput>;
  installedAt?: InputMaybe<ModelIntInput>;
  installedBy?: InputMaybe<ModelStringInput>;
  isDeleted?: InputMaybe<ModelBooleanInput>;
  isDeprecated?: InputMaybe<ModelBooleanInput>;
  isInitialized?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyExtensionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyExtensionConditionInput>>>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelColonyExtensionConnection = {
  __typename?: 'ModelColonyExtensionConnection';
  items: Array<Maybe<ColonyExtension>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyExtensionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyExtensionFilterInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  hash?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  installedAt?: InputMaybe<ModelIntInput>;
  installedBy?: InputMaybe<ModelStringInput>;
  isDeleted?: InputMaybe<ModelBooleanInput>;
  isDeprecated?: InputMaybe<ModelBooleanInput>;
  isInitialized?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyExtensionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyExtensionFilterInput>>>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelColonyFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyFilterInput>>>;
  colonyNativeTokenId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelColonyFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyFilterInput>>>;
  type?: InputMaybe<ModelColonyTypeInput>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelColonyFundsClaimConditionInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyFundsClaimConditionInput>>>;
  colonyFundsClaimTokenId?: InputMaybe<ModelIdInput>;
  colonyFundsClaimsId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  createdAtBlock?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyFundsClaimConditionInput>>>;
};

export type ModelColonyFundsClaimConnection = {
  __typename?: 'ModelColonyFundsClaimConnection';
  items: Array<Maybe<ColonyFundsClaim>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyFundsClaimFilterInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelColonyFundsClaimFilterInput>>>;
  colonyFundsClaimTokenId?: InputMaybe<ModelIdInput>;
  colonyFundsClaimsId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  createdAtBlock?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyFundsClaimFilterInput>>>;
};

export type ModelColonyMetadataConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMetadataConditionInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  isWhitelistActivated?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyMetadataConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMetadataConditionInput>>>;
  thumbnail?: InputMaybe<ModelStringInput>;
  whitelistedAddresses?: InputMaybe<ModelStringInput>;
};

export type ModelColonyMetadataConnection = {
  __typename?: 'ModelColonyMetadataConnection';
  items: Array<Maybe<ColonyMetadata>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyMetadataFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMetadataFilterInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  isWhitelistActivated?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelColonyMetadataFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMetadataFilterInput>>>;
  thumbnail?: InputMaybe<ModelStringInput>;
  whitelistedAddresses?: InputMaybe<ModelStringInput>;
};

export type ModelColonyTokensConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyTokensConditionInput>>>;
  colonyID?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyTokensConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyTokensConditionInput>>>;
  tokenID?: InputMaybe<ModelIdInput>;
};

export type ModelColonyTokensConnection = {
  __typename?: 'ModelColonyTokensConnection';
  items: Array<Maybe<ColonyTokens>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyTokensFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyTokensFilterInput>>>;
  colonyID?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyTokensFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyTokensFilterInput>>>;
  tokenID?: InputMaybe<ModelIdInput>;
};

export type ModelColonyTypeInput = {
  eq?: InputMaybe<ColonyType>;
  ne?: InputMaybe<ColonyType>;
};

export type ModelContractEventConditionInput = {
  agent?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelContractEventConditionInput>>>;
  contractEventColonyId?: InputMaybe<ModelIdInput>;
  contractEventDomainId?: InputMaybe<ModelIdInput>;
  contractEventTokenId?: InputMaybe<ModelIdInput>;
  contractEventUserId?: InputMaybe<ModelIdInput>;
  encodedArguments?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelContractEventConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelContractEventConditionInput>>>;
  signature?: InputMaybe<ModelStringInput>;
  target?: InputMaybe<ModelStringInput>;
};

export type ModelContractEventConnection = {
  __typename?: 'ModelContractEventConnection';
  items: Array<Maybe<ContractEvent>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelContractEventFilterInput = {
  agent?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelContractEventFilterInput>>>;
  contractEventColonyId?: InputMaybe<ModelIdInput>;
  contractEventDomainId?: InputMaybe<ModelIdInput>;
  contractEventTokenId?: InputMaybe<ModelIdInput>;
  contractEventUserId?: InputMaybe<ModelIdInput>;
  encodedArguments?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelContractEventFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelContractEventFilterInput>>>;
  signature?: InputMaybe<ModelStringInput>;
  target?: InputMaybe<ModelStringInput>;
};

export type ModelCurrentNetworkInverseFeeConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>>>;
  inverseFee?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>>>;
};

export type ModelCurrentNetworkInverseFeeConnection = {
  __typename?: 'ModelCurrentNetworkInverseFeeConnection';
  items: Array<Maybe<CurrentNetworkInverseFee>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelCurrentNetworkInverseFeeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelCurrentNetworkInverseFeeFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  inverseFee?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelCurrentNetworkInverseFeeFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCurrentNetworkInverseFeeFilterInput>>>;
};

export type ModelCurrentVersionConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelCurrentVersionConditionInput>>>;
  key?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelCurrentVersionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCurrentVersionConditionInput>>>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelCurrentVersionConnection = {
  __typename?: 'ModelCurrentVersionConnection';
  items: Array<Maybe<CurrentVersion>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelCurrentVersionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelCurrentVersionFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  key?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelCurrentVersionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCurrentVersionFilterInput>>>;
  version?: InputMaybe<ModelIntInput>;
};

export type ModelDomainColorInput = {
  eq?: InputMaybe<DomainColor>;
  ne?: InputMaybe<DomainColor>;
};

export type ModelDomainConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelDomainConditionInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  isRoot?: InputMaybe<ModelBooleanInput>;
  nativeFundingPotId?: InputMaybe<ModelIntInput>;
  nativeId?: InputMaybe<ModelIntInput>;
  nativeSkillId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelDomainConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainConditionInput>>>;
};

export type ModelDomainConnection = {
  __typename?: 'ModelDomainConnection';
  items: Array<Maybe<Domain>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelDomainFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelDomainFilterInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  isRoot?: InputMaybe<ModelBooleanInput>;
  nativeFundingPotId?: InputMaybe<ModelIntInput>;
  nativeId?: InputMaybe<ModelIntInput>;
  nativeSkillId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelDomainFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainFilterInput>>>;
};

export type ModelDomainMetadataConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelDomainMetadataConditionInput>>>;
  color?: InputMaybe<ModelDomainColorInput>;
  description?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelDomainMetadataConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainMetadataConditionInput>>>;
};

export type ModelDomainMetadataConnection = {
  __typename?: 'ModelDomainMetadataConnection';
  items: Array<Maybe<DomainMetadata>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelDomainMetadataFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelDomainMetadataFilterInput>>>;
  color?: InputMaybe<ModelDomainColorInput>;
  description?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelDomainMetadataFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainMetadataFilterInput>>>;
};

export type ModelFloatInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  eq?: InputMaybe<Scalars['Float']>;
  ge?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  le?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
};

export type ModelIdInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  beginsWith?: InputMaybe<Scalars['ID']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  contains?: InputMaybe<Scalars['ID']>;
  eq?: InputMaybe<Scalars['ID']>;
  ge?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  le?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
  ne?: InputMaybe<Scalars['ID']>;
  notContains?: InputMaybe<Scalars['ID']>;
  size?: InputMaybe<ModelSizeInput>;
};

export type ModelIntInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
};

export type ModelMotionMessageConditionInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelMotionMessageConditionInput>>>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  messageKey?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelMotionMessageConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelMotionMessageConditionInput>>>;
  vote?: InputMaybe<ModelStringInput>;
};

export type ModelMotionMessageConnection = {
  __typename?: 'ModelMotionMessageConnection';
  items: Array<Maybe<MotionMessage>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelMotionMessageFilterInput = {
  amount?: InputMaybe<ModelStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelMotionMessageFilterInput>>>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  messageKey?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelMotionMessageFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelMotionMessageFilterInput>>>;
  vote?: InputMaybe<ModelStringInput>;
};

export type ModelProfileConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelProfileConditionInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  bio?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  location?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelProfileConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProfileConditionInput>>>;
  thumbnail?: InputMaybe<ModelStringInput>;
  website?: InputMaybe<ModelStringInput>;
};

export type ModelProfileConnection = {
  __typename?: 'ModelProfileConnection';
  items: Array<Maybe<Profile>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelProfileFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelProfileFilterInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  bio?: InputMaybe<ModelStringInput>;
  displayName?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  location?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelProfileFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProfileFilterInput>>>;
  thumbnail?: InputMaybe<ModelStringInput>;
  website?: InputMaybe<ModelStringInput>;
};

export type ModelSizeInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
};

export enum ModelSortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type ModelStringInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  beginsWith?: InputMaybe<Scalars['String']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contains?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  ge?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  le?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
  notContains?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<ModelSizeInput>;
};

export type ModelStringKeyConditionInput = {
  beginsWith?: InputMaybe<Scalars['String']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  eq?: InputMaybe<Scalars['String']>;
  ge?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  le?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
};

export type ModelSubscriptionBooleanInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
};

export type ModelSubscriptionColonyActionFilterInput = {
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyActionFilterInput>>>;
  blockNumber?: InputMaybe<ModelSubscriptionIntInput>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  fromDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  fundamentalChainId?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  initiatorAddress?: InputMaybe<ModelSubscriptionIdInput>;
  isMotion?: InputMaybe<ModelSubscriptionBooleanInput>;
  newColonyVersion?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyActionFilterInput>>>;
  pendingColonyMetadataId?: InputMaybe<ModelSubscriptionIdInput>;
  pendingDomainMetadataId?: InputMaybe<ModelSubscriptionIdInput>;
  recipientAddress?: InputMaybe<ModelSubscriptionIdInput>;
  showInActionsList?: InputMaybe<ModelSubscriptionBooleanInput>;
  toDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  tokenAddress?: InputMaybe<ModelSubscriptionIdInput>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyExtensionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyExtensionFilterInput>>>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  hash?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  installedAt?: InputMaybe<ModelSubscriptionIntInput>;
  installedBy?: InputMaybe<ModelSubscriptionStringInput>;
  isDeleted?: InputMaybe<ModelSubscriptionBooleanInput>;
  isDeprecated?: InputMaybe<ModelSubscriptionBooleanInput>;
  isInitialized?: InputMaybe<ModelSubscriptionBooleanInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyExtensionFilterInput>>>;
  version?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionColonyFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyFilterInput>>>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
  version?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionColonyFundsClaimFilterInput = {
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>>>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  createdAtBlock?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>>>;
};

export type ModelSubscriptionColonyMetadataFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyMetadataFilterInput>>>;
  avatar?: InputMaybe<ModelSubscriptionStringInput>;
  displayName?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isWhitelistActivated?: InputMaybe<ModelSubscriptionBooleanInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyMetadataFilterInput>>>;
  thumbnail?: InputMaybe<ModelSubscriptionStringInput>;
  whitelistedAddresses?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyTokensFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyTokensFilterInput>>>;
  colonyID?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyTokensFilterInput>>>;
  tokenID?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionContractEventFilterInput = {
  agent?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionContractEventFilterInput>>>;
  encodedArguments?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionContractEventFilterInput>>>;
  signature?: InputMaybe<ModelSubscriptionStringInput>;
  target?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionCurrentNetworkInverseFeeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionCurrentNetworkInverseFeeFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  inverseFee?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionCurrentNetworkInverseFeeFilterInput>>>;
};

export type ModelSubscriptionCurrentVersionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionCurrentVersionFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  key?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionCurrentVersionFilterInput>>>;
  version?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionDomainFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionDomainFilterInput>>>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isRoot?: InputMaybe<ModelSubscriptionBooleanInput>;
  nativeFundingPotId?: InputMaybe<ModelSubscriptionIntInput>;
  nativeId?: InputMaybe<ModelSubscriptionIntInput>;
  nativeSkillId?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionDomainFilterInput>>>;
};

export type ModelSubscriptionDomainMetadataFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionDomainMetadataFilterInput>>>;
  color?: InputMaybe<ModelSubscriptionStringInput>;
  description?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionDomainMetadataFilterInput>>>;
};

export type ModelSubscriptionFloatInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  eq?: InputMaybe<Scalars['Float']>;
  ge?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  le?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};

export type ModelSubscriptionIdInput = {
  beginsWith?: InputMaybe<Scalars['ID']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  contains?: InputMaybe<Scalars['ID']>;
  eq?: InputMaybe<Scalars['ID']>;
  ge?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  le?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
  ne?: InputMaybe<Scalars['ID']>;
  notContains?: InputMaybe<Scalars['ID']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type ModelSubscriptionIntInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type ModelSubscriptionMotionMessageFilterInput = {
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionMotionMessageFilterInput>>>;
  initiatorAddress?: InputMaybe<ModelSubscriptionIdInput>;
  messageKey?: InputMaybe<ModelSubscriptionStringInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionMotionMessageFilterInput>>>;
  vote?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionProfileFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionProfileFilterInput>>>;
  avatar?: InputMaybe<ModelSubscriptionStringInput>;
  bio?: InputMaybe<ModelSubscriptionStringInput>;
  displayName?: InputMaybe<ModelSubscriptionStringInput>;
  email?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  location?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionProfileFilterInput>>>;
  thumbnail?: InputMaybe<ModelSubscriptionStringInput>;
  website?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionStringInput = {
  beginsWith?: InputMaybe<Scalars['String']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contains?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  ge?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  le?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
  notContains?: InputMaybe<Scalars['String']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type ModelSubscriptionTokenFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionTokenFilterInput>>>;
  avatar?: InputMaybe<ModelSubscriptionStringInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  decimals?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionTokenFilterInput>>>;
  symbol?: InputMaybe<ModelSubscriptionStringInput>;
  thumbnail?: InputMaybe<ModelSubscriptionStringInput>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionUserFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFilterInput>>>;
  profileId?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionUserTokensFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserTokensFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserTokensFilterInput>>>;
  tokenID?: InputMaybe<ModelSubscriptionIdInput>;
  userID?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionWatchedColoniesFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionWatchedColoniesFilterInput>>>;
  colonyID?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionWatchedColoniesFilterInput>>>;
  userID?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelTokenConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelTokenConditionInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  decimals?: InputMaybe<ModelIntInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelTokenConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTokenConditionInput>>>;
  symbol?: InputMaybe<ModelStringInput>;
  thumbnail?: InputMaybe<ModelStringInput>;
  type?: InputMaybe<ModelTokenTypeInput>;
};

export type ModelTokenConnection = {
  __typename?: 'ModelTokenConnection';
  items: Array<Maybe<Token>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelTokenFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelTokenFilterInput>>>;
  avatar?: InputMaybe<ModelStringInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  decimals?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelTokenFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTokenFilterInput>>>;
  symbol?: InputMaybe<ModelStringInput>;
  thumbnail?: InputMaybe<ModelStringInput>;
  type?: InputMaybe<ModelTokenTypeInput>;
};

export type ModelTokenTypeInput = {
  eq?: InputMaybe<TokenType>;
  ne?: InputMaybe<TokenType>;
};

export type ModelUserConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserConditionInput>>>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUserConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserConditionInput>>>;
  profileId?: InputMaybe<ModelIdInput>;
};

export type ModelUserConnection = {
  __typename?: 'ModelUserConnection';
  items: Array<Maybe<User>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelUserFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUserFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserFilterInput>>>;
  profileId?: InputMaybe<ModelIdInput>;
};

export type ModelUserTokensConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserTokensConditionInput>>>;
  not?: InputMaybe<ModelUserTokensConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserTokensConditionInput>>>;
  tokenID?: InputMaybe<ModelIdInput>;
  userID?: InputMaybe<ModelIdInput>;
};

export type ModelUserTokensConnection = {
  __typename?: 'ModelUserTokensConnection';
  items: Array<Maybe<UserTokens>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelUserTokensFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelUserTokensFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelUserTokensFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserTokensFilterInput>>>;
  tokenID?: InputMaybe<ModelIdInput>;
  userID?: InputMaybe<ModelIdInput>;
};

export type ModelWatchedColoniesConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelWatchedColoniesConditionInput>>>;
  colonyID?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelWatchedColoniesConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelWatchedColoniesConditionInput>>>;
  userID?: InputMaybe<ModelIdInput>;
};

export type ModelWatchedColoniesConnection = {
  __typename?: 'ModelWatchedColoniesConnection';
  items: Array<Maybe<WatchedColonies>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelWatchedColoniesFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelWatchedColoniesFilterInput>>>;
  colonyID?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelWatchedColoniesFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelWatchedColoniesFilterInput>>>;
  userID?: InputMaybe<ModelIdInput>;
};

export type MotionData = {
  __typename?: 'MotionData';
  createdBy: Scalars['String'];
  hasObjection: Scalars['Boolean'];
  isFinalized: Scalars['Boolean'];
  messages: Array<MotionMessage>;
  motionDomainId: Scalars['String'];
  motionId: Scalars['String'];
  motionStakes: MotionStakes;
  motionStateHistory: MotionStateHistory;
  nativeMotionId: Scalars['String'];
  remainingStakes: Array<Scalars['String']>;
  repSubmitted: Scalars['String'];
  requiredStake: Scalars['String'];
  revealedVotes: MotionStakes;
  rootHash: Scalars['String'];
  skillRep: Scalars['String'];
  stakerRewards: Array<StakerRewards>;
  userMinStake: Scalars['String'];
  usersStakes: Array<UserStakes>;
  voterRecord: Array<VoterRecord>;
};

export type MotionDataInput = {
  createdBy: Scalars['String'];
  hasObjection: Scalars['Boolean'];
  isFinalized: Scalars['Boolean'];
  messages: Array<MotionMessageInput>;
  motionDomainId: Scalars['String'];
  motionId: Scalars['String'];
  motionStakes: MotionStakesInput;
  motionStateHistory: MotionStateHistoryInput;
  nativeMotionId: Scalars['String'];
  remainingStakes: Array<Scalars['String']>;
  repSubmitted: Scalars['String'];
  requiredStake: Scalars['String'];
  revealedVotes: MotionStakesInput;
  rootHash: Scalars['String'];
  skillRep: Scalars['String'];
  stakerRewards: Array<StakerRewardsInput>;
  userMinStake: Scalars['String'];
  usersStakes: Array<UserStakesInput>;
  voterRecord: Array<VoterRecordInput>;
};

export type MotionMessage = {
  __typename?: 'MotionMessage';
  amount?: Maybe<Scalars['String']>;
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  initiatorAddress: Scalars['ID'];
  initiatorUser?: Maybe<User>;
  messageKey: Scalars['String'];
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  vote?: Maybe<Scalars['String']>;
};

export type MotionMessageInput = {
  amount?: InputMaybe<Scalars['String']>;
  initiatorAddress: Scalars['String'];
  messageKey: Scalars['String'];
  name: Scalars['String'];
  vote?: InputMaybe<Scalars['String']>;
};

export type MotionStakeValues = {
  __typename?: 'MotionStakeValues';
  nay: Scalars['String'];
  yay: Scalars['String'];
};

export type MotionStakeValuesInput = {
  nay: Scalars['String'];
  yay: Scalars['String'];
};

export type MotionStakes = {
  __typename?: 'MotionStakes';
  percentage: MotionStakeValues;
  raw: MotionStakeValues;
};

export type MotionStakesInput = {
  percentage: MotionStakeValuesInput;
  raw: MotionStakeValuesInput;
};

export type MotionStateHistory = {
  __typename?: 'MotionStateHistory';
  hasFailed: Scalars['Boolean'];
  hasFailedNotFinalizable: Scalars['Boolean'];
  hasPassed: Scalars['Boolean'];
  hasVoted: Scalars['Boolean'];
  inRevealPhase: Scalars['Boolean'];
};

export type MotionStateHistoryInput = {
  hasFailed: Scalars['Boolean'];
  hasFailedNotFinalizable: Scalars['Boolean'];
  hasPassed: Scalars['Boolean'];
  hasVoted: Scalars['Boolean'];
  inRevealPhase: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createColony?: Maybe<Colony>;
  createColonyAction?: Maybe<ColonyAction>;
  createColonyExtension?: Maybe<ColonyExtension>;
  createColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  createColonyMetadata?: Maybe<ColonyMetadata>;
  createColonyTokens?: Maybe<ColonyTokens>;
  createContractEvent?: Maybe<ContractEvent>;
  createCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  createCurrentVersion?: Maybe<CurrentVersion>;
  createDomain?: Maybe<Domain>;
  createDomainMetadata?: Maybe<DomainMetadata>;
  createMotionMessage?: Maybe<MotionMessage>;
  createProfile?: Maybe<Profile>;
  createToken?: Maybe<Token>;
  createUniqueColony?: Maybe<Colony>;
  createUniqueUser?: Maybe<User>;
  createUser?: Maybe<User>;
  createUserTokens?: Maybe<UserTokens>;
  createWatchedColonies?: Maybe<WatchedColonies>;
  deleteColony?: Maybe<Colony>;
  deleteColonyAction?: Maybe<ColonyAction>;
  deleteColonyExtension?: Maybe<ColonyExtension>;
  deleteColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  deleteColonyMetadata?: Maybe<ColonyMetadata>;
  deleteColonyTokens?: Maybe<ColonyTokens>;
  deleteContractEvent?: Maybe<ContractEvent>;
  deleteCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  deleteCurrentVersion?: Maybe<CurrentVersion>;
  deleteDomain?: Maybe<Domain>;
  deleteDomainMetadata?: Maybe<DomainMetadata>;
  deleteMotionMessage?: Maybe<MotionMessage>;
  deleteProfile?: Maybe<Profile>;
  deleteToken?: Maybe<Token>;
  deleteUser?: Maybe<User>;
  deleteUserTokens?: Maybe<UserTokens>;
  deleteWatchedColonies?: Maybe<WatchedColonies>;
  setCurrentVersion?: Maybe<Scalars['Boolean']>;
  updateColony?: Maybe<Colony>;
  updateColonyAction?: Maybe<ColonyAction>;
  updateColonyExtension?: Maybe<ColonyExtension>;
  updateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  updateColonyMetadata?: Maybe<ColonyMetadata>;
  updateColonyTokens?: Maybe<ColonyTokens>;
  updateContractEvent?: Maybe<ContractEvent>;
  updateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  updateCurrentVersion?: Maybe<CurrentVersion>;
  updateDomain?: Maybe<Domain>;
  updateDomainMetadata?: Maybe<DomainMetadata>;
  updateExtensionByColonyAndHash?: Maybe<ColonyExtension>;
  updateMotionMessage?: Maybe<MotionMessage>;
  updateProfile?: Maybe<Profile>;
  updateToken?: Maybe<Token>;
  updateUser?: Maybe<User>;
  updateUserTokens?: Maybe<UserTokens>;
  updateWatchedColonies?: Maybe<WatchedColonies>;
};


export type MutationCreateColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: CreateColonyInput;
};


export type MutationCreateColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: CreateColonyActionInput;
};


export type MutationCreateColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: CreateColonyExtensionInput;
};


export type MutationCreateColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: CreateColonyFundsClaimInput;
};


export type MutationCreateColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: CreateColonyMetadataInput;
};


export type MutationCreateColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: CreateColonyTokensInput;
};


export type MutationCreateContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: CreateContractEventInput;
};


export type MutationCreateCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: CreateCurrentNetworkInverseFeeInput;
};


export type MutationCreateCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: CreateCurrentVersionInput;
};


export type MutationCreateDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: CreateDomainInput;
};


export type MutationCreateDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: CreateDomainMetadataInput;
};


export type MutationCreateMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: CreateMotionMessageInput;
};


export type MutationCreateProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: CreateProfileInput;
};


export type MutationCreateTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: CreateTokenInput;
};


export type MutationCreateUniqueColonyArgs = {
  input?: InputMaybe<CreateUniqueColonyInput>;
};


export type MutationCreateUniqueUserArgs = {
  input?: InputMaybe<CreateUniqueUserInput>;
};


export type MutationCreateUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: CreateUserInput;
};


export type MutationCreateUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: CreateUserTokensInput;
};


export type MutationCreateWatchedColoniesArgs = {
  condition?: InputMaybe<ModelWatchedColoniesConditionInput>;
  input: CreateWatchedColoniesInput;
};


export type MutationDeleteColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: DeleteColonyInput;
};


export type MutationDeleteColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: DeleteColonyActionInput;
};


export type MutationDeleteColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: DeleteColonyExtensionInput;
};


export type MutationDeleteColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: DeleteColonyFundsClaimInput;
};


export type MutationDeleteColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: DeleteColonyMetadataInput;
};


export type MutationDeleteColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: DeleteColonyTokensInput;
};


export type MutationDeleteContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: DeleteContractEventInput;
};


export type MutationDeleteCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: DeleteCurrentNetworkInverseFeeInput;
};


export type MutationDeleteCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: DeleteCurrentVersionInput;
};


export type MutationDeleteDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: DeleteDomainInput;
};


export type MutationDeleteDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: DeleteDomainMetadataInput;
};


export type MutationDeleteMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: DeleteMotionMessageInput;
};


export type MutationDeleteProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: DeleteProfileInput;
};


export type MutationDeleteTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: DeleteTokenInput;
};


export type MutationDeleteUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: DeleteUserInput;
};


export type MutationDeleteUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: DeleteUserTokensInput;
};


export type MutationDeleteWatchedColoniesArgs = {
  condition?: InputMaybe<ModelWatchedColoniesConditionInput>;
  input: DeleteWatchedColoniesInput;
};


export type MutationSetCurrentVersionArgs = {
  input?: InputMaybe<SetCurrentVersionInput>;
};


export type MutationUpdateColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: UpdateColonyInput;
};


export type MutationUpdateColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: UpdateColonyActionInput;
};


export type MutationUpdateColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: UpdateColonyExtensionInput;
};


export type MutationUpdateColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: UpdateColonyFundsClaimInput;
};


export type MutationUpdateColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: UpdateColonyMetadataInput;
};


export type MutationUpdateColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: UpdateColonyTokensInput;
};


export type MutationUpdateContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: UpdateContractEventInput;
};


export type MutationUpdateCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: UpdateCurrentNetworkInverseFeeInput;
};


export type MutationUpdateCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: UpdateCurrentVersionInput;
};


export type MutationUpdateDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: UpdateDomainInput;
};


export type MutationUpdateDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: UpdateDomainMetadataInput;
};


export type MutationUpdateExtensionByColonyAndHashArgs = {
  input?: InputMaybe<UpdateExtensionByColonyAndHashInput>;
};


export type MutationUpdateMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: UpdateMotionMessageInput;
};


export type MutationUpdateProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: UpdateProfileInput;
};


export type MutationUpdateTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: UpdateTokenInput;
};


export type MutationUpdateUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: UpdateUserInput;
};


export type MutationUpdateUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: UpdateUserTokensInput;
};


export type MutationUpdateWatchedColoniesArgs = {
  condition?: InputMaybe<ModelWatchedColoniesConditionInput>;
  input: UpdateWatchedColoniesInput;
};

export type NativeTokenStatus = {
  __typename?: 'NativeTokenStatus';
  mintable?: Maybe<Scalars['Boolean']>;
  unlockable?: Maybe<Scalars['Boolean']>;
  unlocked?: Maybe<Scalars['Boolean']>;
};

export type NativeTokenStatusInput = {
  mintable?: InputMaybe<Scalars['Boolean']>;
  unlockable?: InputMaybe<Scalars['Boolean']>;
  unlocked?: InputMaybe<Scalars['Boolean']>;
};

export enum Network {
  Ganache = 'GANACHE',
  Gnosis = 'GNOSIS',
  Gnosisfork = 'GNOSISFORK',
  Goerli = 'GOERLI',
  Mainnet = 'MAINNET'
}

export type PendingModifiedTokenAddresses = {
  __typename?: 'PendingModifiedTokenAddresses';
  added?: Maybe<Array<Scalars['String']>>;
  removed?: Maybe<Array<Scalars['String']>>;
};

export type PendingModifiedTokenAddressesInput = {
  added?: InputMaybe<Array<Scalars['String']>>;
  removed?: InputMaybe<Array<Scalars['String']>>;
};

export type Profile = {
  __typename?: 'Profile';
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  createdAt: Scalars['AWSDateTime'];
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['AWSEmail']>;
  id: Scalars['ID'];
  location?: Maybe<Scalars['String']>;
  meta?: Maybe<ProfileMetadata>;
  thumbnail?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
  website?: Maybe<Scalars['AWSURL']>;
};

export type ProfileInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  id?: InputMaybe<Scalars['ID']>;
  location?: InputMaybe<Scalars['String']>;
  meta?: InputMaybe<ProfileMetadataInput>;
  thumbnail?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['AWSURL']>;
};

export type ProfileMetadata = {
  __typename?: 'ProfileMetadata';
  emailPermissions: Array<Scalars['String']>;
};

export type ProfileMetadataInput = {
  emailPermissions: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getActionsByColony?: Maybe<ModelColonyActionConnection>;
  getColony?: Maybe<Colony>;
  getColonyAction?: Maybe<ColonyAction>;
  getColonyByAddress?: Maybe<ModelColonyConnection>;
  getColonyByName?: Maybe<ModelColonyConnection>;
  getColonyByType?: Maybe<ModelColonyConnection>;
  getColonyExtension?: Maybe<ColonyExtension>;
  getColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  getColonyMetadata?: Maybe<ColonyMetadata>;
  getColonyTokens?: Maybe<ColonyTokens>;
  getContractEvent?: Maybe<ContractEvent>;
  getCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  getCurrentVersion?: Maybe<CurrentVersion>;
  getCurrentVersionByKey?: Maybe<ModelCurrentVersionConnection>;
  getDomain?: Maybe<Domain>;
  getDomainMetadata?: Maybe<DomainMetadata>;
  getExtensionByColonyAndHash?: Maybe<ModelColonyExtensionConnection>;
  getMembersForColony?: Maybe<MembersForColonyReturn>;
  getMotionMessage?: Maybe<MotionMessage>;
  getMotionState: Scalars['Int'];
  getMotionTimeoutPeriods?: Maybe<GetMotionTimeoutPeriodsReturn>;
  getProfile?: Maybe<Profile>;
  getProfileByEmail?: Maybe<ModelProfileConnection>;
  getReputationForTopDomains?: Maybe<GetReputationForTopDomainsReturn>;
  getToken?: Maybe<Token>;
  getTokenByAddress?: Maybe<ModelTokenConnection>;
  getTokenFromEverywhere?: Maybe<TokenFromEverywhereReturn>;
  getTokensByType?: Maybe<ModelTokenConnection>;
  getUser?: Maybe<User>;
  getUserByAddress?: Maybe<ModelUserConnection>;
  getUserByName?: Maybe<ModelUserConnection>;
  getUserReputation?: Maybe<Scalars['String']>;
  getUserTokenBalance?: Maybe<GetUserTokenBalanceReturn>;
  getUserTokens?: Maybe<UserTokens>;
  getVoterRewards?: Maybe<VoterRewardsReturn>;
  getWatchedColonies?: Maybe<WatchedColonies>;
  listColonies?: Maybe<ModelColonyConnection>;
  listColonyActions?: Maybe<ModelColonyActionConnection>;
  listColonyExtensions?: Maybe<ModelColonyExtensionConnection>;
  listColonyFundsClaims?: Maybe<ModelColonyFundsClaimConnection>;
  listColonyMetadata?: Maybe<ModelColonyMetadataConnection>;
  listColonyTokens?: Maybe<ModelColonyTokensConnection>;
  listContractEvents?: Maybe<ModelContractEventConnection>;
  listCurrentNetworkInverseFees?: Maybe<ModelCurrentNetworkInverseFeeConnection>;
  listCurrentVersions?: Maybe<ModelCurrentVersionConnection>;
  listDomainMetadata?: Maybe<ModelDomainMetadataConnection>;
  listDomains?: Maybe<ModelDomainConnection>;
  listMotionMessages?: Maybe<ModelMotionMessageConnection>;
  listProfiles?: Maybe<ModelProfileConnection>;
  listTokens?: Maybe<ModelTokenConnection>;
  listUserTokens?: Maybe<ModelUserTokensConnection>;
  listUsers?: Maybe<ModelUserConnection>;
  listWatchedColonies?: Maybe<ModelWatchedColoniesConnection>;
};


export type QueryGetActionsByColonyArgs = {
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGetColonyArgs = {
  id: Scalars['ID'];
};


export type QueryGetColonyActionArgs = {
  id: Scalars['ID'];
};


export type QueryGetColonyByAddressArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGetColonyByNameArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGetColonyByTypeArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: ColonyType;
};


export type QueryGetColonyExtensionArgs = {
  id: Scalars['ID'];
};


export type QueryGetColonyFundsClaimArgs = {
  id: Scalars['ID'];
};


export type QueryGetColonyMetadataArgs = {
  id: Scalars['ID'];
};


export type QueryGetColonyTokensArgs = {
  id: Scalars['ID'];
};


export type QueryGetContractEventArgs = {
  id: Scalars['ID'];
};


export type QueryGetCurrentNetworkInverseFeeArgs = {
  id: Scalars['ID'];
};


export type QueryGetCurrentVersionArgs = {
  id: Scalars['ID'];
};


export type QueryGetCurrentVersionByKeyArgs = {
  filter?: InputMaybe<ModelCurrentVersionFilterInput>;
  key: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGetDomainArgs = {
  id: Scalars['ID'];
};


export type QueryGetDomainMetadataArgs = {
  id: Scalars['ID'];
};


export type QueryGetExtensionByColonyAndHashArgs = {
  colonyId: Scalars['ID'];
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGetMembersForColonyArgs = {
  input?: InputMaybe<MembersForColonyInput>;
};


export type QueryGetMotionMessageArgs = {
  id: Scalars['ID'];
};


export type QueryGetMotionStateArgs = {
  input?: InputMaybe<GetMotionStateInput>;
};


export type QueryGetMotionTimeoutPeriodsArgs = {
  input?: InputMaybe<GetMotionTimeoutPeriodsInput>;
};


export type QueryGetProfileArgs = {
  id: Scalars['ID'];
};


export type QueryGetProfileByEmailArgs = {
  email: Scalars['AWSEmail'];
  filter?: InputMaybe<ModelProfileFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGetReputationForTopDomainsArgs = {
  input?: InputMaybe<GetReputationForTopDomainsInput>;
};


export type QueryGetTokenArgs = {
  id: Scalars['ID'];
};


export type QueryGetTokenByAddressArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGetTokenFromEverywhereArgs = {
  input?: InputMaybe<TokenFromEverywhereArguments>;
};


export type QueryGetTokensByTypeArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: TokenType;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetUserByAddressArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGetUserByNameArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type QueryGetUserReputationArgs = {
  input?: InputMaybe<GetUserReputationInput>;
};


export type QueryGetUserTokenBalanceArgs = {
  input?: InputMaybe<GetUserTokenBalanceInput>;
};


export type QueryGetUserTokensArgs = {
  id: Scalars['ID'];
};


export type QueryGetVoterRewardsArgs = {
  input?: InputMaybe<GetVoterRewardsInput>;
};


export type QueryGetWatchedColoniesArgs = {
  id: Scalars['ID'];
};


export type QueryListColoniesArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListColonyActionsArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListColonyExtensionsArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListColonyFundsClaimsArgs = {
  filter?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListColonyMetadataArgs = {
  filter?: InputMaybe<ModelColonyMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListColonyTokensArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListContractEventsArgs = {
  filter?: InputMaybe<ModelContractEventFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListCurrentNetworkInverseFeesArgs = {
  filter?: InputMaybe<ModelCurrentNetworkInverseFeeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListCurrentVersionsArgs = {
  filter?: InputMaybe<ModelCurrentVersionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListDomainMetadataArgs = {
  filter?: InputMaybe<ModelDomainMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListDomainsArgs = {
  filter?: InputMaybe<ModelDomainFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListMotionMessagesArgs = {
  filter?: InputMaybe<ModelMotionMessageFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListProfilesArgs = {
  filter?: InputMaybe<ModelProfileFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListTokensArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListUserTokensArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListUsersArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListWatchedColoniesArgs = {
  filter?: InputMaybe<ModelWatchedColoniesFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

export type SetCurrentVersionInput = {
  key: Scalars['String'];
  version: Scalars['Int'];
};

export enum SortingMethod {
  ByHighestRep = 'BY_HIGHEST_REP',
  ByLessPermissions = 'BY_LESS_PERMISSIONS',
  ByLowestRep = 'BY_LOWEST_REP',
  ByMorePermissions = 'BY_MORE_PERMISSIONS'
}

export type StakerRewards = {
  __typename?: 'StakerRewards';
  address: Scalars['String'];
  isClaimed: Scalars['Boolean'];
  rewards: MotionStakeValues;
};

export type StakerRewardsInput = {
  address: Scalars['String'];
  isClaimed: Scalars['Boolean'];
  rewards: MotionStakeValuesInput;
};

export type Subscription = {
  __typename?: 'Subscription';
  onCreateColony?: Maybe<Colony>;
  onCreateColonyAction?: Maybe<ColonyAction>;
  onCreateColonyExtension?: Maybe<ColonyExtension>;
  onCreateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onCreateColonyMetadata?: Maybe<ColonyMetadata>;
  onCreateColonyTokens?: Maybe<ColonyTokens>;
  onCreateContractEvent?: Maybe<ContractEvent>;
  onCreateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onCreateCurrentVersion?: Maybe<CurrentVersion>;
  onCreateDomain?: Maybe<Domain>;
  onCreateDomainMetadata?: Maybe<DomainMetadata>;
  onCreateMotionMessage?: Maybe<MotionMessage>;
  onCreateProfile?: Maybe<Profile>;
  onCreateToken?: Maybe<Token>;
  onCreateUser?: Maybe<User>;
  onCreateUserTokens?: Maybe<UserTokens>;
  onCreateWatchedColonies?: Maybe<WatchedColonies>;
  onDeleteColony?: Maybe<Colony>;
  onDeleteColonyAction?: Maybe<ColonyAction>;
  onDeleteColonyExtension?: Maybe<ColonyExtension>;
  onDeleteColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onDeleteColonyMetadata?: Maybe<ColonyMetadata>;
  onDeleteColonyTokens?: Maybe<ColonyTokens>;
  onDeleteContractEvent?: Maybe<ContractEvent>;
  onDeleteCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onDeleteCurrentVersion?: Maybe<CurrentVersion>;
  onDeleteDomain?: Maybe<Domain>;
  onDeleteDomainMetadata?: Maybe<DomainMetadata>;
  onDeleteMotionMessage?: Maybe<MotionMessage>;
  onDeleteProfile?: Maybe<Profile>;
  onDeleteToken?: Maybe<Token>;
  onDeleteUser?: Maybe<User>;
  onDeleteUserTokens?: Maybe<UserTokens>;
  onDeleteWatchedColonies?: Maybe<WatchedColonies>;
  onUpdateColony?: Maybe<Colony>;
  onUpdateColonyAction?: Maybe<ColonyAction>;
  onUpdateColonyExtension?: Maybe<ColonyExtension>;
  onUpdateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onUpdateColonyMetadata?: Maybe<ColonyMetadata>;
  onUpdateColonyTokens?: Maybe<ColonyTokens>;
  onUpdateContractEvent?: Maybe<ContractEvent>;
  onUpdateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onUpdateCurrentVersion?: Maybe<CurrentVersion>;
  onUpdateDomain?: Maybe<Domain>;
  onUpdateDomainMetadata?: Maybe<DomainMetadata>;
  onUpdateMotionMessage?: Maybe<MotionMessage>;
  onUpdateProfile?: Maybe<Profile>;
  onUpdateToken?: Maybe<Token>;
  onUpdateUser?: Maybe<User>;
  onUpdateUserTokens?: Maybe<UserTokens>;
  onUpdateWatchedColonies?: Maybe<WatchedColonies>;
};


export type SubscriptionOnCreateColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFilterInput>;
};


export type SubscriptionOnCreateColonyActionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionFilterInput>;
};


export type SubscriptionOnCreateColonyExtensionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyExtensionFilterInput>;
};


export type SubscriptionOnCreateColonyFundsClaimArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>;
};


export type SubscriptionOnCreateColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};


export type SubscriptionOnCreateColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};


export type SubscriptionOnCreateContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
};


export type SubscriptionOnCreateCurrentNetworkInverseFeeArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentNetworkInverseFeeFilterInput>;
};


export type SubscriptionOnCreateCurrentVersionArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentVersionFilterInput>;
};


export type SubscriptionOnCreateDomainArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainFilterInput>;
};


export type SubscriptionOnCreateDomainMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainMetadataFilterInput>;
};


export type SubscriptionOnCreateMotionMessageArgs = {
  filter?: InputMaybe<ModelSubscriptionMotionMessageFilterInput>;
};


export type SubscriptionOnCreateProfileArgs = {
  filter?: InputMaybe<ModelSubscriptionProfileFilterInput>;
};


export type SubscriptionOnCreateTokenArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenFilterInput>;
};


export type SubscriptionOnCreateUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
};


export type SubscriptionOnCreateUserTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionUserTokensFilterInput>;
};


export type SubscriptionOnCreateWatchedColoniesArgs = {
  filter?: InputMaybe<ModelSubscriptionWatchedColoniesFilterInput>;
};


export type SubscriptionOnDeleteColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFilterInput>;
};


export type SubscriptionOnDeleteColonyActionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionFilterInput>;
};


export type SubscriptionOnDeleteColonyExtensionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyExtensionFilterInput>;
};


export type SubscriptionOnDeleteColonyFundsClaimArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>;
};


export type SubscriptionOnDeleteColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};


export type SubscriptionOnDeleteColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};


export type SubscriptionOnDeleteContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
};


export type SubscriptionOnDeleteCurrentNetworkInverseFeeArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentNetworkInverseFeeFilterInput>;
};


export type SubscriptionOnDeleteCurrentVersionArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentVersionFilterInput>;
};


export type SubscriptionOnDeleteDomainArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainFilterInput>;
};


export type SubscriptionOnDeleteDomainMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainMetadataFilterInput>;
};


export type SubscriptionOnDeleteMotionMessageArgs = {
  filter?: InputMaybe<ModelSubscriptionMotionMessageFilterInput>;
};


export type SubscriptionOnDeleteProfileArgs = {
  filter?: InputMaybe<ModelSubscriptionProfileFilterInput>;
};


export type SubscriptionOnDeleteTokenArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenFilterInput>;
};


export type SubscriptionOnDeleteUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
};


export type SubscriptionOnDeleteUserTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionUserTokensFilterInput>;
};


export type SubscriptionOnDeleteWatchedColoniesArgs = {
  filter?: InputMaybe<ModelSubscriptionWatchedColoniesFilterInput>;
};


export type SubscriptionOnUpdateColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFilterInput>;
};


export type SubscriptionOnUpdateColonyActionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyActionFilterInput>;
};


export type SubscriptionOnUpdateColonyExtensionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyExtensionFilterInput>;
};


export type SubscriptionOnUpdateColonyFundsClaimArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>;
};


export type SubscriptionOnUpdateColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};


export type SubscriptionOnUpdateColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};


export type SubscriptionOnUpdateContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
};


export type SubscriptionOnUpdateCurrentNetworkInverseFeeArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentNetworkInverseFeeFilterInput>;
};


export type SubscriptionOnUpdateCurrentVersionArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentVersionFilterInput>;
};


export type SubscriptionOnUpdateDomainArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainFilterInput>;
};


export type SubscriptionOnUpdateDomainMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainMetadataFilterInput>;
};


export type SubscriptionOnUpdateMotionMessageArgs = {
  filter?: InputMaybe<ModelSubscriptionMotionMessageFilterInput>;
};


export type SubscriptionOnUpdateProfileArgs = {
  filter?: InputMaybe<ModelSubscriptionProfileFilterInput>;
};


export type SubscriptionOnUpdateTokenArgs = {
  filter?: InputMaybe<ModelSubscriptionTokenFilterInput>;
};


export type SubscriptionOnUpdateUserArgs = {
  filter?: InputMaybe<ModelSubscriptionUserFilterInput>;
};


export type SubscriptionOnUpdateUserTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionUserTokensFilterInput>;
};


export type SubscriptionOnUpdateWatchedColoniesArgs = {
  filter?: InputMaybe<ModelSubscriptionWatchedColoniesFilterInput>;
};

export type Token = {
  __typename?: 'Token';
  avatar?: Maybe<Scalars['String']>;
  chainMetadata?: Maybe<ChainMetadata>;
  colonies?: Maybe<ModelColonyTokensConnection>;
  createdAt: Scalars['AWSDateTime'];
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  thumbnail?: Maybe<Scalars['String']>;
  type?: Maybe<TokenType>;
  updatedAt: Scalars['AWSDateTime'];
  users?: Maybe<ModelUserTokensConnection>;
};


export type TokenColoniesArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type TokenUsersArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type TokenFromEverywhereArguments = {
  tokenAddress: Scalars['String'];
};

export type TokenFromEverywhereReturn = {
  __typename?: 'TokenFromEverywhereReturn';
  items?: Maybe<Array<Maybe<Token>>>;
};

export type TokenInput = {
  id: Scalars['ID'];
};

export enum TokenType {
  ChainNative = 'CHAIN_NATIVE',
  Colony = 'COLONY',
  Erc20 = 'ERC20'
}

export type UpdateColonyActionInput = {
  amount?: InputMaybe<Scalars['String']>;
  blockNumber?: InputMaybe<Scalars['Int']>;
  colonyActionsId?: InputMaybe<Scalars['ID']>;
  colonyId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  fromDomainId?: InputMaybe<Scalars['ID']>;
  fundamentalChainId?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  initiatorAddress?: InputMaybe<Scalars['ID']>;
  isMotion?: InputMaybe<Scalars['Boolean']>;
  motionData?: InputMaybe<MotionDataInput>;
  newColonyVersion?: InputMaybe<Scalars['Int']>;
  pendingColonyMetadataId?: InputMaybe<Scalars['ID']>;
  pendingDomainMetadataId?: InputMaybe<Scalars['ID']>;
  recipientAddress?: InputMaybe<Scalars['ID']>;
  showInActionsList?: InputMaybe<Scalars['Boolean']>;
  toDomainId?: InputMaybe<Scalars['ID']>;
  tokenAddress?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<ColonyActionType>;
};

export type UpdateColonyExtensionInput = {
  colonyId?: InputMaybe<Scalars['ID']>;
  hash?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  installedAt?: InputMaybe<Scalars['AWSTimestamp']>;
  installedBy?: InputMaybe<Scalars['String']>;
  isDeleted?: InputMaybe<Scalars['Boolean']>;
  isDeprecated?: InputMaybe<Scalars['Boolean']>;
  isInitialized?: InputMaybe<Scalars['Boolean']>;
  params?: InputMaybe<ExtensionParamsInput>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateColonyFundsClaimInput = {
  amount?: InputMaybe<Scalars['String']>;
  colonyFundsClaimTokenId?: InputMaybe<Scalars['ID']>;
  colonyFundsClaimsId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdAtBlock?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
};

export type UpdateColonyInput = {
  balances?: InputMaybe<ColonyBalancesInput>;
  chainFundsClaim?: InputMaybe<ColonyChainFundsClaimInput>;
  chainMetadata?: InputMaybe<ChainMetadataInput>;
  colonyNativeTokenId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateColonyMetadataInput = {
  avatar?: InputMaybe<Scalars['String']>;
  changelog?: InputMaybe<Array<ColonyMetadataChangelogInput>>;
  displayName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isWhitelistActivated?: InputMaybe<Scalars['Boolean']>;
  modifiedTokenAddresses?: InputMaybe<PendingModifiedTokenAddressesInput>;
  thumbnail?: InputMaybe<Scalars['String']>;
  whitelistedAddresses?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateColonyTokensInput = {
  colonyID?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  tokenID?: InputMaybe<Scalars['ID']>;
};

export type UpdateContractEventInput = {
  agent?: InputMaybe<Scalars['String']>;
  chainMetadata?: InputMaybe<ChainMetadataInput>;
  contractEventColonyId?: InputMaybe<Scalars['ID']>;
  contractEventDomainId?: InputMaybe<Scalars['ID']>;
  contractEventTokenId?: InputMaybe<Scalars['ID']>;
  contractEventUserId?: InputMaybe<Scalars['ID']>;
  encodedArguments?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  signature?: InputMaybe<Scalars['String']>;
  target?: InputMaybe<Scalars['String']>;
};

export type UpdateCurrentNetworkInverseFeeInput = {
  id: Scalars['ID'];
  inverseFee?: InputMaybe<Scalars['String']>;
};

export type UpdateCurrentVersionInput = {
  id: Scalars['ID'];
  key?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateDomainInput = {
  colonyId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  isRoot?: InputMaybe<Scalars['Boolean']>;
  nativeFundingPotId?: InputMaybe<Scalars['Int']>;
  nativeId?: InputMaybe<Scalars['Int']>;
  nativeSkillId?: InputMaybe<Scalars['Int']>;
};

export type UpdateDomainMetadataInput = {
  changelog?: InputMaybe<Array<DomainMetadataChangelogInput>>;
  color?: InputMaybe<DomainColor>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateExtensionByColonyAndHashInput = {
  colonyId: Scalars['ID'];
  hash: Scalars['String'];
  installedAt?: InputMaybe<Scalars['AWSTimestamp']>;
  installedBy?: InputMaybe<Scalars['String']>;
  isDeleted?: InputMaybe<Scalars['Boolean']>;
  isDeprecated?: InputMaybe<Scalars['Boolean']>;
  isInitialized?: InputMaybe<Scalars['Boolean']>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateMotionMessageInput = {
  amount?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  initiatorAddress?: InputMaybe<Scalars['ID']>;
  messageKey?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  vote?: InputMaybe<Scalars['String']>;
};

export type UpdateProfileInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  id: Scalars['ID'];
  location?: InputMaybe<Scalars['String']>;
  meta?: InputMaybe<ProfileMetadataInput>;
  thumbnail?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['AWSURL']>;
};

export type UpdateTokenInput = {
  avatar?: InputMaybe<Scalars['String']>;
  chainMetadata?: InputMaybe<ChainMetadataInput>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  decimals?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  thumbnail?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<TokenType>;
};

export type UpdateUserInput = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  profileId?: InputMaybe<Scalars['ID']>;
};

export type UpdateUserTokensInput = {
  id: Scalars['ID'];
  tokenID?: InputMaybe<Scalars['ID']>;
  userID?: InputMaybe<Scalars['ID']>;
};

export type UpdateWatchedColoniesInput = {
  colonyID?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  userID?: InputMaybe<Scalars['ID']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  profile?: Maybe<Profile>;
  profileId?: Maybe<Scalars['ID']>;
  tokens?: Maybe<ModelUserTokensConnection>;
  updatedAt: Scalars['AWSDateTime'];
  watchlist?: Maybe<ModelWatchedColoniesConnection>;
};


export type UserTokensArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


export type UserWatchlistArgs = {
  filter?: InputMaybe<ModelWatchedColoniesFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

export type UserDomainReputation = {
  __typename?: 'UserDomainReputation';
  domainId: Scalars['Int'];
  reputationPercentage: Scalars['String'];
};

export type UserStakes = {
  __typename?: 'UserStakes';
  address: Scalars['String'];
  stakes: MotionStakes;
};

export type UserStakesInput = {
  address: Scalars['String'];
  stakes: MotionStakesInput;
};

export type UserTokens = {
  __typename?: 'UserTokens';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  token: Token;
  tokenID: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  user: User;
  userID: Scalars['ID'];
};

export type VoterRecord = {
  __typename?: 'VoterRecord';
  address: Scalars['String'];
  vote?: Maybe<Scalars['Int']>;
  voteCount: Scalars['String'];
};

export type VoterRecordInput = {
  address: Scalars['String'];
  vote?: InputMaybe<Scalars['Int']>;
  voteCount: Scalars['String'];
};

export type VoterRewardsReturn = {
  __typename?: 'VoterRewardsReturn';
  max: Scalars['String'];
  min: Scalars['String'];
  reward: Scalars['String'];
};

export type VotingReputationParams = {
  __typename?: 'VotingReputationParams';
  escalationPeriod: Scalars['String'];
  maxVoteFraction: Scalars['String'];
  revealPeriod: Scalars['String'];
  stakePeriod: Scalars['String'];
  submitPeriod: Scalars['String'];
  totalStakeFraction: Scalars['String'];
  userMinStakeFraction: Scalars['String'];
  voterRewardFraction: Scalars['String'];
};

export type VotingReputationParamsInput = {
  escalationPeriod: Scalars['String'];
  maxVoteFraction: Scalars['String'];
  revealPeriod: Scalars['String'];
  stakePeriod: Scalars['String'];
  submitPeriod: Scalars['String'];
  totalStakeFraction: Scalars['String'];
  userMinStakeFraction: Scalars['String'];
  voterRewardFraction: Scalars['String'];
};

export type WatchedColonies = {
  __typename?: 'WatchedColonies';
  colony: Colony;
  colonyID: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  user: User;
  userID: Scalars['ID'];
};

export type Watcher = {
  __typename?: 'Watcher';
  user?: Maybe<User>;
};

export type ColonyActionFragment = { __typename?: 'ColonyAction', type: ColonyActionType, blockNumber: number, initiatorAddress: string, recipientAddress?: string | null, amount?: string | null, tokenAddress?: string | null, createdAt: string, newColonyVersion?: number | null, isMotion?: boolean | null, showInActionsList: boolean, transactionHash: string, colonyAddress: string, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null, recipient?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null, token?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, fromDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, toDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, motionData?: { __typename?: 'MotionData', remainingStakes: Array<string>, userMinStake: string, requiredStake: string, rootHash: string, motionDomainId: string, isFinalized: boolean, skillRep: string, repSubmitted: string, hasObjection: boolean, databaseMotionId: string, motionId: string, motionStakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, usersStakes: Array<{ __typename?: 'UserStakes', address: string, stakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } } }>, stakerRewards: Array<{ __typename?: 'StakerRewards', address: string, isClaimed: boolean, rewards: { __typename?: 'MotionStakeValues', yay: string, nay: string } }>, voterRecord: Array<{ __typename?: 'VoterRecord', address: string, voteCount: string, vote?: number | null }>, revealedVotes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, motionStateHistory: { __typename?: 'MotionStateHistory', hasVoted: boolean, hasPassed: boolean, hasFailed: boolean, hasFailedNotFinalizable: boolean, inRevealPhase: boolean }, messages: Array<{ __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null }> } | null, colony: { __typename?: 'Colony', colonyAddress: string, nativeToken: { __typename?: 'Token', nativeTokenDecimals: number, nativeTokenSymbol: string, tokenAddress: string } }, pendingDomainMetadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null, pendingColonyMetadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null };

export type MotionStakeValuesFragment = { __typename?: 'MotionStakeValues', yay: string, nay: string };

export type MotionDataFragment = { __typename?: 'MotionData', remainingStakes: Array<string>, userMinStake: string, requiredStake: string, rootHash: string, motionDomainId: string, isFinalized: boolean, skillRep: string, repSubmitted: string, hasObjection: boolean, databaseMotionId: string, motionId: string, motionStakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, usersStakes: Array<{ __typename?: 'UserStakes', address: string, stakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } } }>, stakerRewards: Array<{ __typename?: 'StakerRewards', address: string, isClaimed: boolean, rewards: { __typename?: 'MotionStakeValues', yay: string, nay: string } }>, voterRecord: Array<{ __typename?: 'VoterRecord', address: string, voteCount: string, vote?: number | null }>, revealedVotes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, motionStateHistory: { __typename?: 'MotionStateHistory', hasVoted: boolean, hasPassed: boolean, hasFailed: boolean, hasFailedNotFinalizable: boolean, inRevealPhase: boolean }, messages: Array<{ __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null }> };

export type MotionMessageFragment = { __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null };

export type ColonyFragment = { __typename?: 'Colony', name: string, version: number, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null };

export type WatchedColonyFragment = { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null };

export type WatchListItemFragment = { __typename?: 'WatchedColonies', createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } };

export type ColonyMetadataFragment = { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null };

export type ColonyBalancesFragment = { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null };

export type ColonyBalanceFragment = { __typename?: 'ColonyBalance', id: string, balance: string, domain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } };

export type FundsClaimFragment = { __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } };

export type ChainFundsClaimFragment = { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string };

export type DomainFragment = { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null };

export type DomainMetadataFragment = { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null };

export type ExtensionFragment = { __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null };

export type TokenFragment = { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string };

export type UserTokenBalanceDataFragment = { __typename?: 'GetUserTokenBalanceReturn', balance?: string | null, inactiveBalance?: string | null, lockedBalance?: string | null, activeBalance?: string | null, pendingBalance?: string | null };

export type UserFragment = { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null };

export type ProfileFragment = { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null };

export type MemberUserFragment = { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null };

export type ContributorFragment = { __typename?: 'Contributor', reputationPercentage?: string | null, reputationAmount?: string | null, user?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null } | null };

export type WatcherFragment = { __typename?: 'Watcher', user?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null } | null };

export type CreateUniqueColonyMutationVariables = Exact<{
  input: CreateUniqueColonyInput;
}>;


export type CreateUniqueColonyMutation = { __typename?: 'Mutation', createUniqueColony?: { __typename?: 'Colony', id: string } | null };

export type CreateWatchedColoniesMutationVariables = Exact<{
  input: CreateWatchedColoniesInput;
}>;


export type CreateWatchedColoniesMutation = { __typename?: 'Mutation', createWatchedColonies?: { __typename?: 'WatchedColonies', id: string } | null };

export type CreateColonyMetadataMutationVariables = Exact<{
  input: CreateColonyMetadataInput;
}>;


export type CreateColonyMetadataMutation = { __typename?: 'Mutation', createColonyMetadata?: { __typename?: 'ColonyMetadata', id: string } | null };

export type UpdateColonyMetadataMutationVariables = Exact<{
  input: UpdateColonyMetadataInput;
}>;


export type UpdateColonyMetadataMutation = { __typename?: 'Mutation', updateColonyMetadata?: { __typename?: 'ColonyMetadata', id: string } | null };

export type DeleteWatchedColoniesMutationVariables = Exact<{
  input: DeleteWatchedColoniesInput;
}>;


export type DeleteWatchedColoniesMutation = { __typename?: 'Mutation', deleteWatchedColonies?: { __typename?: 'WatchedColonies', id: string } | null };

export type CreateDomainMetadataMutationVariables = Exact<{
  input: CreateDomainMetadataInput;
}>;


export type CreateDomainMetadataMutation = { __typename?: 'Mutation', createDomainMetadata?: { __typename?: 'DomainMetadata', id: string } | null };

export type UpdateDomainMetadataMutationVariables = Exact<{
  input: UpdateDomainMetadataInput;
}>;


export type UpdateDomainMetadataMutation = { __typename?: 'Mutation', updateDomainMetadata?: { __typename?: 'DomainMetadata', id: string } | null };

export type CreateDomainMutationVariables = Exact<{
  input: CreateDomainInput;
}>;


export type CreateDomainMutation = { __typename?: 'Mutation', createDomain?: { __typename?: 'Domain', id: string } | null };

export type CreateColonyTokensMutationVariables = Exact<{
  input: CreateColonyTokensInput;
}>;


export type CreateColonyTokensMutation = { __typename?: 'Mutation', createColonyTokens?: { __typename?: 'ColonyTokens', id: string } | null };

export type CreateUserTokensMutationVariables = Exact<{
  input: CreateUserTokensInput;
}>;


export type CreateUserTokensMutation = { __typename?: 'Mutation', createUserTokens?: { __typename?: 'UserTokens', id: string } | null };

export type DeleteColonyTokensMutationVariables = Exact<{
  input: DeleteColonyTokensInput;
}>;


export type DeleteColonyTokensMutation = { __typename?: 'Mutation', deleteColonyTokens?: { __typename?: 'ColonyTokens', id: string } | null };

export type CreateUniqueUserMutationVariables = Exact<{
  input: CreateUniqueUserInput;
}>;


export type CreateUniqueUserMutation = { __typename?: 'Mutation', createUniqueUser?: { __typename?: 'User', id: string } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateProfile?: { __typename?: 'Profile', id: string, avatar?: string | null, bio?: string | null, displayName?: string | null, location?: string | null, website?: string | null, email?: string | null } | null };

export type GetColonyActionsQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  filter?: InputMaybe<ModelColonyActionFilterInput>;
}>;


export type GetColonyActionsQuery = { __typename?: 'Query', getActionsByColony?: { __typename?: 'ModelColonyActionConnection', nextToken?: string | null, items: Array<{ __typename?: 'ColonyAction', type: ColonyActionType, blockNumber: number, initiatorAddress: string, recipientAddress?: string | null, amount?: string | null, tokenAddress?: string | null, createdAt: string, newColonyVersion?: number | null, isMotion?: boolean | null, showInActionsList: boolean, transactionHash: string, colonyAddress: string, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null, recipient?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null, token?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, fromDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, toDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, motionData?: { __typename?: 'MotionData', remainingStakes: Array<string>, userMinStake: string, requiredStake: string, rootHash: string, motionDomainId: string, isFinalized: boolean, skillRep: string, repSubmitted: string, hasObjection: boolean, databaseMotionId: string, motionId: string, motionStakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, usersStakes: Array<{ __typename?: 'UserStakes', address: string, stakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } } }>, stakerRewards: Array<{ __typename?: 'StakerRewards', address: string, isClaimed: boolean, rewards: { __typename?: 'MotionStakeValues', yay: string, nay: string } }>, voterRecord: Array<{ __typename?: 'VoterRecord', address: string, voteCount: string, vote?: number | null }>, revealedVotes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, motionStateHistory: { __typename?: 'MotionStateHistory', hasVoted: boolean, hasPassed: boolean, hasFailed: boolean, hasFailedNotFinalizable: boolean, inRevealPhase: boolean }, messages: Array<{ __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null }> } | null, colony: { __typename?: 'Colony', colonyAddress: string, nativeToken: { __typename?: 'Token', nativeTokenDecimals: number, nativeTokenSymbol: string, tokenAddress: string } }, pendingDomainMetadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null, pendingColonyMetadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } | null> } | null };

export type GetColonyActionQueryVariables = Exact<{
  transactionHash: Scalars['ID'];
}>;


export type GetColonyActionQuery = { __typename?: 'Query', getColonyAction?: { __typename?: 'ColonyAction', type: ColonyActionType, blockNumber: number, initiatorAddress: string, recipientAddress?: string | null, amount?: string | null, tokenAddress?: string | null, createdAt: string, newColonyVersion?: number | null, isMotion?: boolean | null, showInActionsList: boolean, transactionHash: string, colonyAddress: string, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null, recipient?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null, token?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, fromDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, toDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, motionData?: { __typename?: 'MotionData', remainingStakes: Array<string>, userMinStake: string, requiredStake: string, rootHash: string, motionDomainId: string, isFinalized: boolean, skillRep: string, repSubmitted: string, hasObjection: boolean, databaseMotionId: string, motionId: string, motionStakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, usersStakes: Array<{ __typename?: 'UserStakes', address: string, stakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } } }>, stakerRewards: Array<{ __typename?: 'StakerRewards', address: string, isClaimed: boolean, rewards: { __typename?: 'MotionStakeValues', yay: string, nay: string } }>, voterRecord: Array<{ __typename?: 'VoterRecord', address: string, voteCount: string, vote?: number | null }>, revealedVotes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, motionStateHistory: { __typename?: 'MotionStateHistory', hasVoted: boolean, hasPassed: boolean, hasFailed: boolean, hasFailedNotFinalizable: boolean, inRevealPhase: boolean }, messages: Array<{ __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null }> } | null, colony: { __typename?: 'Colony', colonyAddress: string, nativeToken: { __typename?: 'Token', nativeTokenDecimals: number, nativeTokenSymbol: string, tokenAddress: string } }, pendingDomainMetadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null, pendingColonyMetadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } | null };

export type GetFullColonyByAddressQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type GetFullColonyByAddressQuery = { __typename?: 'Query', getColonyByAddress?: { __typename?: 'ModelColonyConnection', items: Array<{ __typename?: 'Colony', name: string, version: number, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } | null> } | null };

export type GetFullColonyByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetFullColonyByNameQuery = { __typename?: 'Query', getColonyByName?: { __typename?: 'ModelColonyConnection', items: Array<{ __typename?: 'Colony', name: string, version: number, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } | null> } | null };

export type GetMetacolonyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMetacolonyQuery = { __typename?: 'Query', getColonyByType?: { __typename?: 'ModelColonyConnection', items: Array<{ __typename?: 'Colony', name: string, version: number, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } | null> } | null };

export type GetColonyExtensionsQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
}>;


export type GetColonyExtensionsQuery = { __typename?: 'Query', getColony?: { __typename?: 'Colony', colonyAddress: string, extensions?: { __typename?: 'ModelColonyExtensionConnection', items: Array<{ __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null } | null> } | null } | null };

export type GetColonyExtensionQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
  extensionHash: Scalars['String'];
}>;


export type GetColonyExtensionQuery = { __typename?: 'Query', getExtensionByColonyAndHash?: { __typename?: 'ModelColonyExtensionConnection', items: Array<{ __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null } | null> } | null };

export type GetMembersForColonyQueryVariables = Exact<{
  input: MembersForColonyInput;
}>;


export type GetMembersForColonyQuery = { __typename?: 'Query', getMembersForColony?: { __typename?: 'MembersForColonyReturn', contributors?: Array<{ __typename?: 'Contributor', reputationPercentage?: string | null, reputationAmount?: string | null, user?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null } | null }> | null, watchers?: Array<{ __typename?: 'Watcher', user?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null } | null }> | null } | null };

export type GetMotionStateQueryVariables = Exact<{
  input: GetMotionStateInput;
}>;


export type GetMotionStateQuery = { __typename?: 'Query', getMotionState: number };

export type GetVoterRewardsQueryVariables = Exact<{
  input: GetVoterRewardsInput;
}>;


export type GetVoterRewardsQuery = { __typename?: 'Query', getVoterRewards?: { __typename?: 'VoterRewardsReturn', min: string, max: string, reward: string } | null };

export type GetMotionTimeoutPeriodsQueryVariables = Exact<{
  input: GetMotionTimeoutPeriodsInput;
}>;


export type GetMotionTimeoutPeriodsQuery = { __typename?: 'Query', getMotionTimeoutPeriods?: { __typename?: 'GetMotionTimeoutPeriodsReturn', timeLeftToStake: string, timeLeftToVote: string, timeLeftToReveal: string, timeLeftToEscalate: string } | null };

export type GetCurrentNetworkInverseFeeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentNetworkInverseFeeQuery = { __typename?: 'Query', listCurrentNetworkInverseFees?: { __typename?: 'ModelCurrentNetworkInverseFeeConnection', items: Array<{ __typename?: 'CurrentNetworkInverseFee', inverseFee: string } | null> } | null };

export type GetProfileByEmailQueryVariables = Exact<{
  email: Scalars['AWSEmail'];
}>;


export type GetProfileByEmailQuery = { __typename?: 'Query', getProfileByEmail?: { __typename?: 'ModelProfileConnection', items: Array<{ __typename?: 'Profile', id: string } | null> } | null };

export type GetTokenByAddressQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type GetTokenByAddressQuery = { __typename?: 'Query', getTokenByAddress?: { __typename?: 'ModelTokenConnection', items: Array<{ __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null> } | null };

export type GetTokenFromEverywhereQueryVariables = Exact<{
  input: TokenFromEverywhereArguments;
}>;


export type GetTokenFromEverywhereQuery = { __typename?: 'Query', getTokenFromEverywhere?: { __typename?: 'TokenFromEverywhereReturn', items?: Array<{ __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null> | null } | null };

export type GetUserTokenBalanceQueryVariables = Exact<{
  input: GetUserTokenBalanceInput;
}>;


export type GetUserTokenBalanceQuery = { __typename?: 'Query', getUserTokenBalance?: { __typename?: 'GetUserTokenBalanceReturn', balance?: string | null, inactiveBalance?: string | null, lockedBalance?: string | null, activeBalance?: string | null, pendingBalance?: string | null } | null };

export type GetUserByAddressQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type GetUserByAddressQuery = { __typename?: 'Query', getUserByAddress?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null> } | null };

export type GetUserReputationQueryVariables = Exact<{
  input: GetUserReputationInput;
}>;


export type GetUserReputationQuery = { __typename?: 'Query', getUserReputation?: string | null };

export type GetReputationForTopDomainsQueryVariables = Exact<{
  input: GetReputationForTopDomainsInput;
}>;


export type GetReputationForTopDomainsQuery = { __typename?: 'Query', getReputationForTopDomains?: { __typename?: 'GetReputationForTopDomainsReturn', items?: Array<{ __typename?: 'UserDomainReputation', domainId: number, reputationPercentage: string }> | null } | null };

export type GetUserByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetUserByNameQuery = { __typename?: 'Query', getUserByName?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null> } | null };

export type CombinedUserQueryVariables = Exact<{
  name: Scalars['String'];
  address: Scalars['ID'];
}>;


export type CombinedUserQuery = { __typename?: 'Query', getUserByAddress?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null> } | null, getUserByName?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null> } | null };

export type GetUsersQueryVariables = Exact<{
  filter?: InputMaybe<ModelUserFilterInput>;
}>;


export type GetUsersQuery = { __typename?: 'Query', listUsers?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata?: { __typename?: 'ChainMetadata', chainId?: number | null, network?: Network | null } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null> } | null };

export type GetCurrentExtensionsVersionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentExtensionsVersionsQuery = { __typename?: 'Query', listCurrentVersions?: { __typename?: 'ModelCurrentVersionConnection', items: Array<{ __typename?: 'CurrentVersion', version: number, extensionHash: string } | null> } | null };

export type GetCurrentExtensionVersionQueryVariables = Exact<{
  extensionHash: Scalars['String'];
}>;


export type GetCurrentExtensionVersionQuery = { __typename?: 'Query', getCurrentVersionByKey?: { __typename?: 'ModelCurrentVersionConnection', items: Array<{ __typename?: 'CurrentVersion', version: number, extensionHash: string } | null> } | null };

export type GetCurrentColonyVersionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentColonyVersionQuery = { __typename?: 'Query', getCurrentVersionByKey?: { __typename?: 'ModelCurrentVersionConnection', items: Array<{ __typename?: 'CurrentVersion', version: number } | null> } | null };

export const ProfileFragmentDoc = gql`
    fragment Profile on Profile {
  avatar
  bio
  displayName
  email
  location
  thumbnail
  website
}
    `;
export const ColonyMetadataFragmentDoc = gql`
    fragment ColonyMetadata on ColonyMetadata {
  displayName
  avatar
  thumbnail
  isWhitelistActivated
  whitelistedAddresses
  changelog {
    transactionHash
    newDisplayName
    oldDisplayName
    hasAvatarChanged
    hasWhitelistChanged
    haveTokensChanged
  }
}
    `;
export const WatchedColonyFragmentDoc = gql`
    fragment WatchedColony on Colony {
  colonyAddress: id
  name
  chainMetadata {
    chainId
    network
  }
  metadata {
    ...ColonyMetadata
  }
}
    ${ColonyMetadataFragmentDoc}`;
export const UserFragmentDoc = gql`
    fragment User on User {
  profile {
    ...Profile
  }
  walletAddress: id
  name
  watchlist {
    items {
      id
      colony {
        ...WatchedColony
      }
      createdAt
    }
  }
}
    ${ProfileFragmentDoc}
${WatchedColonyFragmentDoc}`;
export const TokenFragmentDoc = gql`
    fragment Token on Token {
  decimals
  tokenAddress: id
  name
  symbol
  type
  avatar
  thumbnail
}
    `;
export const DomainMetadataFragmentDoc = gql`
    fragment DomainMetadata on DomainMetadata {
  name
  color
  description
  changelog {
    transactionHash
    oldName
    newName
    oldColor
    newColor
    oldDescription
    newDescription
  }
}
    `;
export const DomainFragmentDoc = gql`
    fragment Domain on Domain {
  id
  nativeId
  isRoot
  nativeFundingPotId
  metadata {
    ...DomainMetadata
  }
}
    ${DomainMetadataFragmentDoc}`;
export const MotionStakeValuesFragmentDoc = gql`
    fragment MotionStakeValues on MotionStakeValues {
  yay
  nay
}
    `;
export const MotionMessageFragmentDoc = gql`
    fragment MotionMessage on MotionMessage {
  initiatorAddress
  name
  messageKey
  initiatorUser {
    ...User
  }
  vote
  amount
}
    ${UserFragmentDoc}`;
export const MotionDataFragmentDoc = gql`
    fragment MotionData on MotionData {
  databaseMotionId: motionId
  motionId: nativeMotionId
  motionStakes {
    raw {
      ...MotionStakeValues
    }
    percentage {
      ...MotionStakeValues
    }
  }
  usersStakes {
    address
    stakes {
      raw {
        ...MotionStakeValues
      }
      percentage {
        ...MotionStakeValues
      }
    }
  }
  remainingStakes
  userMinStake
  requiredStake
  rootHash
  motionDomainId
  stakerRewards {
    address
    rewards {
      yay
      nay
    }
    isClaimed
  }
  isFinalized
  voterRecord {
    address
    voteCount
    vote
  }
  revealedVotes {
    raw {
      yay
      nay
    }
    percentage {
      yay
      nay
    }
  }
  skillRep
  repSubmitted
  hasObjection
  motionStateHistory {
    hasVoted
    hasPassed
    hasFailed
    hasFailedNotFinalizable
    inRevealPhase
  }
  messages {
    ...MotionMessage
  }
}
    ${MotionStakeValuesFragmentDoc}
${MotionMessageFragmentDoc}`;
export const ColonyActionFragmentDoc = gql`
    fragment ColonyAction on ColonyAction {
  transactionHash: id
  colonyAddress: colonyId
  type
  blockNumber
  initiatorAddress
  initiatorUser {
    ...User
  }
  recipientAddress
  recipient {
    ...User
  }
  amount
  tokenAddress
  token {
    ...Token
  }
  fromDomain {
    ...Domain
  }
  toDomain {
    ...Domain
  }
  createdAt
  newColonyVersion
  isMotion
  motionData {
    ...MotionData
  }
  colony {
    colonyAddress: id
    nativeToken {
      nativeTokenDecimals: decimals
      nativeTokenSymbol: symbol
      tokenAddress: id
    }
  }
  showInActionsList
  pendingDomainMetadata {
    ...DomainMetadata
  }
  pendingColonyMetadata {
    ...ColonyMetadata
  }
}
    ${UserFragmentDoc}
${TokenFragmentDoc}
${DomainFragmentDoc}
${MotionDataFragmentDoc}
${DomainMetadataFragmentDoc}
${ColonyMetadataFragmentDoc}`;
export const ColonyBalanceFragmentDoc = gql`
    fragment ColonyBalance on ColonyBalance {
  id
  balance
  domain {
    ...Domain
  }
  token {
    ...Token
  }
}
    ${DomainFragmentDoc}
${TokenFragmentDoc}`;
export const ColonyBalancesFragmentDoc = gql`
    fragment ColonyBalances on ColonyBalances {
  items {
    ...ColonyBalance
  }
}
    ${ColonyBalanceFragmentDoc}`;
export const FundsClaimFragmentDoc = gql`
    fragment FundsClaim on ColonyFundsClaim {
  id
  token {
    ...Token
  }
  createdAtBlock
  createdAt
  amount
}
    ${TokenFragmentDoc}`;
export const ChainFundsClaimFragmentDoc = gql`
    fragment ChainFundsClaim on ColonyChainFundsClaim {
  id
  createdAtBlock
  createdAt
  amount
}
    `;
export const ColonyFragmentDoc = gql`
    fragment Colony on Colony {
  colonyAddress: id
  name
  nativeToken {
    ...Token
  }
  status {
    recovery
    nativeToken {
      mintable
      unlockable
      unlocked
    }
  }
  chainMetadata {
    chainId
    network
  }
  tokens {
    items {
      colonyTokensId: id
      token {
        ...Token
      }
    }
  }
  domains {
    items {
      ...Domain
    }
  }
  balances {
    ...ColonyBalances
  }
  fundsClaims {
    items {
      ...FundsClaim
    }
  }
  chainFundsClaim {
    ...ChainFundsClaim
  }
  version
  metadata {
    ...ColonyMetadata
  }
}
    ${TokenFragmentDoc}
${DomainFragmentDoc}
${ColonyBalancesFragmentDoc}
${FundsClaimFragmentDoc}
${ChainFundsClaimFragmentDoc}
${ColonyMetadataFragmentDoc}`;
export const WatchListItemFragmentDoc = gql`
    fragment WatchListItem on WatchedColonies {
  colony {
    ...WatchedColony
  }
  createdAt
}
    ${WatchedColonyFragmentDoc}`;
export const ExtensionFragmentDoc = gql`
    fragment Extension on ColonyExtension {
  address: id
  colonyAddress: colonyId
  hash
  currentVersion: version
  installedBy
  installedAt
  isDeprecated
  isDeleted
  isInitialized
  params {
    votingReputation {
      maxVoteFraction
    }
  }
}
    `;
export const UserTokenBalanceDataFragmentDoc = gql`
    fragment UserTokenBalanceData on GetUserTokenBalanceReturn {
  balance
  inactiveBalance
  lockedBalance
  activeBalance
  pendingBalance
}
    `;
export const MemberUserFragmentDoc = gql`
    fragment MemberUser on User {
  walletAddress: id
  name
  profile {
    ...Profile
  }
}
    ${ProfileFragmentDoc}`;
export const ContributorFragmentDoc = gql`
    fragment Contributor on Contributor {
  user {
    ...MemberUser
  }
  reputationPercentage
  reputationAmount
}
    ${MemberUserFragmentDoc}`;
export const WatcherFragmentDoc = gql`
    fragment Watcher on Watcher {
  user {
    ...MemberUser
  }
}
    ${MemberUserFragmentDoc}`;
export const CreateUniqueColonyDocument = gql`
    mutation CreateUniqueColony($input: CreateUniqueColonyInput!) {
  createUniqueColony(input: $input) {
    id
  }
}
    `;
export type CreateUniqueColonyMutationFn = Apollo.MutationFunction<CreateUniqueColonyMutation, CreateUniqueColonyMutationVariables>;

/**
 * __useCreateUniqueColonyMutation__
 *
 * To run a mutation, you first call `useCreateUniqueColonyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUniqueColonyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUniqueColonyMutation, { data, loading, error }] = useCreateUniqueColonyMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUniqueColonyMutation(baseOptions?: Apollo.MutationHookOptions<CreateUniqueColonyMutation, CreateUniqueColonyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUniqueColonyMutation, CreateUniqueColonyMutationVariables>(CreateUniqueColonyDocument, options);
      }
export type CreateUniqueColonyMutationHookResult = ReturnType<typeof useCreateUniqueColonyMutation>;
export type CreateUniqueColonyMutationResult = Apollo.MutationResult<CreateUniqueColonyMutation>;
export type CreateUniqueColonyMutationOptions = Apollo.BaseMutationOptions<CreateUniqueColonyMutation, CreateUniqueColonyMutationVariables>;
export const CreateWatchedColoniesDocument = gql`
    mutation CreateWatchedColonies($input: CreateWatchedColoniesInput!) {
  createWatchedColonies(input: $input) {
    id
  }
}
    `;
export type CreateWatchedColoniesMutationFn = Apollo.MutationFunction<CreateWatchedColoniesMutation, CreateWatchedColoniesMutationVariables>;

/**
 * __useCreateWatchedColoniesMutation__
 *
 * To run a mutation, you first call `useCreateWatchedColoniesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWatchedColoniesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWatchedColoniesMutation, { data, loading, error }] = useCreateWatchedColoniesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateWatchedColoniesMutation(baseOptions?: Apollo.MutationHookOptions<CreateWatchedColoniesMutation, CreateWatchedColoniesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWatchedColoniesMutation, CreateWatchedColoniesMutationVariables>(CreateWatchedColoniesDocument, options);
      }
export type CreateWatchedColoniesMutationHookResult = ReturnType<typeof useCreateWatchedColoniesMutation>;
export type CreateWatchedColoniesMutationResult = Apollo.MutationResult<CreateWatchedColoniesMutation>;
export type CreateWatchedColoniesMutationOptions = Apollo.BaseMutationOptions<CreateWatchedColoniesMutation, CreateWatchedColoniesMutationVariables>;
export const CreateColonyMetadataDocument = gql`
    mutation CreateColonyMetadata($input: CreateColonyMetadataInput!) {
  createColonyMetadata(input: $input) {
    id
  }
}
    `;
export type CreateColonyMetadataMutationFn = Apollo.MutationFunction<CreateColonyMetadataMutation, CreateColonyMetadataMutationVariables>;

/**
 * __useCreateColonyMetadataMutation__
 *
 * To run a mutation, you first call `useCreateColonyMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateColonyMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createColonyMetadataMutation, { data, loading, error }] = useCreateColonyMetadataMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateColonyMetadataMutation(baseOptions?: Apollo.MutationHookOptions<CreateColonyMetadataMutation, CreateColonyMetadataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateColonyMetadataMutation, CreateColonyMetadataMutationVariables>(CreateColonyMetadataDocument, options);
      }
export type CreateColonyMetadataMutationHookResult = ReturnType<typeof useCreateColonyMetadataMutation>;
export type CreateColonyMetadataMutationResult = Apollo.MutationResult<CreateColonyMetadataMutation>;
export type CreateColonyMetadataMutationOptions = Apollo.BaseMutationOptions<CreateColonyMetadataMutation, CreateColonyMetadataMutationVariables>;
export const UpdateColonyMetadataDocument = gql`
    mutation UpdateColonyMetadata($input: UpdateColonyMetadataInput!) {
  updateColonyMetadata(input: $input) {
    id
  }
}
    `;
export type UpdateColonyMetadataMutationFn = Apollo.MutationFunction<UpdateColonyMetadataMutation, UpdateColonyMetadataMutationVariables>;

/**
 * __useUpdateColonyMetadataMutation__
 *
 * To run a mutation, you first call `useUpdateColonyMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateColonyMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateColonyMetadataMutation, { data, loading, error }] = useUpdateColonyMetadataMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateColonyMetadataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateColonyMetadataMutation, UpdateColonyMetadataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateColonyMetadataMutation, UpdateColonyMetadataMutationVariables>(UpdateColonyMetadataDocument, options);
      }
export type UpdateColonyMetadataMutationHookResult = ReturnType<typeof useUpdateColonyMetadataMutation>;
export type UpdateColonyMetadataMutationResult = Apollo.MutationResult<UpdateColonyMetadataMutation>;
export type UpdateColonyMetadataMutationOptions = Apollo.BaseMutationOptions<UpdateColonyMetadataMutation, UpdateColonyMetadataMutationVariables>;
export const DeleteWatchedColoniesDocument = gql`
    mutation DeleteWatchedColonies($input: DeleteWatchedColoniesInput!) {
  deleteWatchedColonies(input: $input) {
    id
  }
}
    `;
export type DeleteWatchedColoniesMutationFn = Apollo.MutationFunction<DeleteWatchedColoniesMutation, DeleteWatchedColoniesMutationVariables>;

/**
 * __useDeleteWatchedColoniesMutation__
 *
 * To run a mutation, you first call `useDeleteWatchedColoniesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteWatchedColoniesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteWatchedColoniesMutation, { data, loading, error }] = useDeleteWatchedColoniesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteWatchedColoniesMutation(baseOptions?: Apollo.MutationHookOptions<DeleteWatchedColoniesMutation, DeleteWatchedColoniesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteWatchedColoniesMutation, DeleteWatchedColoniesMutationVariables>(DeleteWatchedColoniesDocument, options);
      }
export type DeleteWatchedColoniesMutationHookResult = ReturnType<typeof useDeleteWatchedColoniesMutation>;
export type DeleteWatchedColoniesMutationResult = Apollo.MutationResult<DeleteWatchedColoniesMutation>;
export type DeleteWatchedColoniesMutationOptions = Apollo.BaseMutationOptions<DeleteWatchedColoniesMutation, DeleteWatchedColoniesMutationVariables>;
export const CreateDomainMetadataDocument = gql`
    mutation CreateDomainMetadata($input: CreateDomainMetadataInput!) {
  createDomainMetadata(input: $input) {
    id
  }
}
    `;
export type CreateDomainMetadataMutationFn = Apollo.MutationFunction<CreateDomainMetadataMutation, CreateDomainMetadataMutationVariables>;

/**
 * __useCreateDomainMetadataMutation__
 *
 * To run a mutation, you first call `useCreateDomainMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDomainMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDomainMetadataMutation, { data, loading, error }] = useCreateDomainMetadataMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDomainMetadataMutation(baseOptions?: Apollo.MutationHookOptions<CreateDomainMetadataMutation, CreateDomainMetadataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDomainMetadataMutation, CreateDomainMetadataMutationVariables>(CreateDomainMetadataDocument, options);
      }
export type CreateDomainMetadataMutationHookResult = ReturnType<typeof useCreateDomainMetadataMutation>;
export type CreateDomainMetadataMutationResult = Apollo.MutationResult<CreateDomainMetadataMutation>;
export type CreateDomainMetadataMutationOptions = Apollo.BaseMutationOptions<CreateDomainMetadataMutation, CreateDomainMetadataMutationVariables>;
export const UpdateDomainMetadataDocument = gql`
    mutation UpdateDomainMetadata($input: UpdateDomainMetadataInput!) {
  updateDomainMetadata(input: $input) {
    id
  }
}
    `;
export type UpdateDomainMetadataMutationFn = Apollo.MutationFunction<UpdateDomainMetadataMutation, UpdateDomainMetadataMutationVariables>;

/**
 * __useUpdateDomainMetadataMutation__
 *
 * To run a mutation, you first call `useUpdateDomainMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDomainMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDomainMetadataMutation, { data, loading, error }] = useUpdateDomainMetadataMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDomainMetadataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDomainMetadataMutation, UpdateDomainMetadataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDomainMetadataMutation, UpdateDomainMetadataMutationVariables>(UpdateDomainMetadataDocument, options);
      }
export type UpdateDomainMetadataMutationHookResult = ReturnType<typeof useUpdateDomainMetadataMutation>;
export type UpdateDomainMetadataMutationResult = Apollo.MutationResult<UpdateDomainMetadataMutation>;
export type UpdateDomainMetadataMutationOptions = Apollo.BaseMutationOptions<UpdateDomainMetadataMutation, UpdateDomainMetadataMutationVariables>;
export const CreateDomainDocument = gql`
    mutation CreateDomain($input: CreateDomainInput!) {
  createDomain(input: $input) {
    id
  }
}
    `;
export type CreateDomainMutationFn = Apollo.MutationFunction<CreateDomainMutation, CreateDomainMutationVariables>;

/**
 * __useCreateDomainMutation__
 *
 * To run a mutation, you first call `useCreateDomainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDomainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDomainMutation, { data, loading, error }] = useCreateDomainMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDomainMutation(baseOptions?: Apollo.MutationHookOptions<CreateDomainMutation, CreateDomainMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDomainMutation, CreateDomainMutationVariables>(CreateDomainDocument, options);
      }
export type CreateDomainMutationHookResult = ReturnType<typeof useCreateDomainMutation>;
export type CreateDomainMutationResult = Apollo.MutationResult<CreateDomainMutation>;
export type CreateDomainMutationOptions = Apollo.BaseMutationOptions<CreateDomainMutation, CreateDomainMutationVariables>;
export const CreateColonyTokensDocument = gql`
    mutation CreateColonyTokens($input: CreateColonyTokensInput!) {
  createColonyTokens(input: $input) {
    id
  }
}
    `;
export type CreateColonyTokensMutationFn = Apollo.MutationFunction<CreateColonyTokensMutation, CreateColonyTokensMutationVariables>;

/**
 * __useCreateColonyTokensMutation__
 *
 * To run a mutation, you first call `useCreateColonyTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateColonyTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createColonyTokensMutation, { data, loading, error }] = useCreateColonyTokensMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateColonyTokensMutation(baseOptions?: Apollo.MutationHookOptions<CreateColonyTokensMutation, CreateColonyTokensMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateColonyTokensMutation, CreateColonyTokensMutationVariables>(CreateColonyTokensDocument, options);
      }
export type CreateColonyTokensMutationHookResult = ReturnType<typeof useCreateColonyTokensMutation>;
export type CreateColonyTokensMutationResult = Apollo.MutationResult<CreateColonyTokensMutation>;
export type CreateColonyTokensMutationOptions = Apollo.BaseMutationOptions<CreateColonyTokensMutation, CreateColonyTokensMutationVariables>;
export const CreateUserTokensDocument = gql`
    mutation CreateUserTokens($input: CreateUserTokensInput!) {
  createUserTokens(input: $input) {
    id
  }
}
    `;
export type CreateUserTokensMutationFn = Apollo.MutationFunction<CreateUserTokensMutation, CreateUserTokensMutationVariables>;

/**
 * __useCreateUserTokensMutation__
 *
 * To run a mutation, you first call `useCreateUserTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserTokensMutation, { data, loading, error }] = useCreateUserTokensMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserTokensMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserTokensMutation, CreateUserTokensMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserTokensMutation, CreateUserTokensMutationVariables>(CreateUserTokensDocument, options);
      }
export type CreateUserTokensMutationHookResult = ReturnType<typeof useCreateUserTokensMutation>;
export type CreateUserTokensMutationResult = Apollo.MutationResult<CreateUserTokensMutation>;
export type CreateUserTokensMutationOptions = Apollo.BaseMutationOptions<CreateUserTokensMutation, CreateUserTokensMutationVariables>;
export const DeleteColonyTokensDocument = gql`
    mutation DeleteColonyTokens($input: DeleteColonyTokensInput!) {
  deleteColonyTokens(input: $input) {
    id
  }
}
    `;
export type DeleteColonyTokensMutationFn = Apollo.MutationFunction<DeleteColonyTokensMutation, DeleteColonyTokensMutationVariables>;

/**
 * __useDeleteColonyTokensMutation__
 *
 * To run a mutation, you first call `useDeleteColonyTokensMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteColonyTokensMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteColonyTokensMutation, { data, loading, error }] = useDeleteColonyTokensMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteColonyTokensMutation(baseOptions?: Apollo.MutationHookOptions<DeleteColonyTokensMutation, DeleteColonyTokensMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteColonyTokensMutation, DeleteColonyTokensMutationVariables>(DeleteColonyTokensDocument, options);
      }
export type DeleteColonyTokensMutationHookResult = ReturnType<typeof useDeleteColonyTokensMutation>;
export type DeleteColonyTokensMutationResult = Apollo.MutationResult<DeleteColonyTokensMutation>;
export type DeleteColonyTokensMutationOptions = Apollo.BaseMutationOptions<DeleteColonyTokensMutation, DeleteColonyTokensMutationVariables>;
export const CreateUniqueUserDocument = gql`
    mutation CreateUniqueUser($input: CreateUniqueUserInput!) {
  createUniqueUser(input: $input) {
    id
  }
}
    `;
export type CreateUniqueUserMutationFn = Apollo.MutationFunction<CreateUniqueUserMutation, CreateUniqueUserMutationVariables>;

/**
 * __useCreateUniqueUserMutation__
 *
 * To run a mutation, you first call `useCreateUniqueUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUniqueUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUniqueUserMutation, { data, loading, error }] = useCreateUniqueUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUniqueUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUniqueUserMutation, CreateUniqueUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUniqueUserMutation, CreateUniqueUserMutationVariables>(CreateUniqueUserDocument, options);
      }
export type CreateUniqueUserMutationHookResult = ReturnType<typeof useCreateUniqueUserMutation>;
export type CreateUniqueUserMutationResult = Apollo.MutationResult<CreateUniqueUserMutation>;
export type CreateUniqueUserMutationOptions = Apollo.BaseMutationOptions<CreateUniqueUserMutation, CreateUniqueUserMutationVariables>;
export const UpdateUserProfileDocument = gql`
    mutation UpdateUserProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    avatar
    bio
    displayName
    location
    website
    email
  }
}
    `;
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const GetColonyActionsDocument = gql`
    query GetColonyActions($colonyAddress: ID!, $nextToken: String, $limit: Int, $sortDirection: ModelSortDirection, $filter: ModelColonyActionFilterInput) {
  getActionsByColony(
    colonyId: $colonyAddress
    nextToken: $nextToken
    limit: $limit
    sortDirection: $sortDirection
    filter: $filter
  ) {
    items {
      ...ColonyAction
    }
    nextToken
  }
}
    ${ColonyActionFragmentDoc}`;

/**
 * __useGetColonyActionsQuery__
 *
 * To run a query within a React component, call `useGetColonyActionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetColonyActionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetColonyActionsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      nextToken: // value for 'nextToken'
 *      limit: // value for 'limit'
 *      sortDirection: // value for 'sortDirection'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetColonyActionsQuery(baseOptions: Apollo.QueryHookOptions<GetColonyActionsQuery, GetColonyActionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetColonyActionsQuery, GetColonyActionsQueryVariables>(GetColonyActionsDocument, options);
      }
export function useGetColonyActionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetColonyActionsQuery, GetColonyActionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetColonyActionsQuery, GetColonyActionsQueryVariables>(GetColonyActionsDocument, options);
        }
export type GetColonyActionsQueryHookResult = ReturnType<typeof useGetColonyActionsQuery>;
export type GetColonyActionsLazyQueryHookResult = ReturnType<typeof useGetColonyActionsLazyQuery>;
export type GetColonyActionsQueryResult = Apollo.QueryResult<GetColonyActionsQuery, GetColonyActionsQueryVariables>;
export const GetColonyActionDocument = gql`
    query GetColonyAction($transactionHash: ID!) {
  getColonyAction(id: $transactionHash) {
    ...ColonyAction
  }
}
    ${ColonyActionFragmentDoc}`;

/**
 * __useGetColonyActionQuery__
 *
 * To run a query within a React component, call `useGetColonyActionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetColonyActionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetColonyActionQuery({
 *   variables: {
 *      transactionHash: // value for 'transactionHash'
 *   },
 * });
 */
export function useGetColonyActionQuery(baseOptions: Apollo.QueryHookOptions<GetColonyActionQuery, GetColonyActionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetColonyActionQuery, GetColonyActionQueryVariables>(GetColonyActionDocument, options);
      }
export function useGetColonyActionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetColonyActionQuery, GetColonyActionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetColonyActionQuery, GetColonyActionQueryVariables>(GetColonyActionDocument, options);
        }
export type GetColonyActionQueryHookResult = ReturnType<typeof useGetColonyActionQuery>;
export type GetColonyActionLazyQueryHookResult = ReturnType<typeof useGetColonyActionLazyQuery>;
export type GetColonyActionQueryResult = Apollo.QueryResult<GetColonyActionQuery, GetColonyActionQueryVariables>;
export const GetFullColonyByAddressDocument = gql`
    query GetFullColonyByAddress($address: ID!) {
  getColonyByAddress(id: $address) {
    items {
      ...Colony
    }
  }
}
    ${ColonyFragmentDoc}`;

/**
 * __useGetFullColonyByAddressQuery__
 *
 * To run a query within a React component, call `useGetFullColonyByAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullColonyByAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullColonyByAddressQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetFullColonyByAddressQuery(baseOptions: Apollo.QueryHookOptions<GetFullColonyByAddressQuery, GetFullColonyByAddressQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFullColonyByAddressQuery, GetFullColonyByAddressQueryVariables>(GetFullColonyByAddressDocument, options);
      }
export function useGetFullColonyByAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFullColonyByAddressQuery, GetFullColonyByAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFullColonyByAddressQuery, GetFullColonyByAddressQueryVariables>(GetFullColonyByAddressDocument, options);
        }
export type GetFullColonyByAddressQueryHookResult = ReturnType<typeof useGetFullColonyByAddressQuery>;
export type GetFullColonyByAddressLazyQueryHookResult = ReturnType<typeof useGetFullColonyByAddressLazyQuery>;
export type GetFullColonyByAddressQueryResult = Apollo.QueryResult<GetFullColonyByAddressQuery, GetFullColonyByAddressQueryVariables>;
export const GetFullColonyByNameDocument = gql`
    query GetFullColonyByName($name: String!) {
  getColonyByName(name: $name) {
    items {
      ...Colony
    }
  }
}
    ${ColonyFragmentDoc}`;

/**
 * __useGetFullColonyByNameQuery__
 *
 * To run a query within a React component, call `useGetFullColonyByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullColonyByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullColonyByNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetFullColonyByNameQuery(baseOptions: Apollo.QueryHookOptions<GetFullColonyByNameQuery, GetFullColonyByNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFullColonyByNameQuery, GetFullColonyByNameQueryVariables>(GetFullColonyByNameDocument, options);
      }
export function useGetFullColonyByNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFullColonyByNameQuery, GetFullColonyByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFullColonyByNameQuery, GetFullColonyByNameQueryVariables>(GetFullColonyByNameDocument, options);
        }
export type GetFullColonyByNameQueryHookResult = ReturnType<typeof useGetFullColonyByNameQuery>;
export type GetFullColonyByNameLazyQueryHookResult = ReturnType<typeof useGetFullColonyByNameLazyQuery>;
export type GetFullColonyByNameQueryResult = Apollo.QueryResult<GetFullColonyByNameQuery, GetFullColonyByNameQueryVariables>;
export const GetMetacolonyDocument = gql`
    query GetMetacolony {
  getColonyByType(type: METACOLONY) {
    items {
      ...Colony
    }
  }
}
    ${ColonyFragmentDoc}`;

/**
 * __useGetMetacolonyQuery__
 *
 * To run a query within a React component, call `useGetMetacolonyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMetacolonyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMetacolonyQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMetacolonyQuery(baseOptions?: Apollo.QueryHookOptions<GetMetacolonyQuery, GetMetacolonyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMetacolonyQuery, GetMetacolonyQueryVariables>(GetMetacolonyDocument, options);
      }
export function useGetMetacolonyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMetacolonyQuery, GetMetacolonyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMetacolonyQuery, GetMetacolonyQueryVariables>(GetMetacolonyDocument, options);
        }
export type GetMetacolonyQueryHookResult = ReturnType<typeof useGetMetacolonyQuery>;
export type GetMetacolonyLazyQueryHookResult = ReturnType<typeof useGetMetacolonyLazyQuery>;
export type GetMetacolonyQueryResult = Apollo.QueryResult<GetMetacolonyQuery, GetMetacolonyQueryVariables>;
export const GetColonyExtensionsDocument = gql`
    query GetColonyExtensions($colonyAddress: ID!) {
  getColony(id: $colonyAddress) {
    colonyAddress: id
    extensions(filter: {isDeleted: {eq: false}}) {
      items {
        ...Extension
      }
    }
  }
}
    ${ExtensionFragmentDoc}`;

/**
 * __useGetColonyExtensionsQuery__
 *
 * To run a query within a React component, call `useGetColonyExtensionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetColonyExtensionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetColonyExtensionsQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *   },
 * });
 */
export function useGetColonyExtensionsQuery(baseOptions: Apollo.QueryHookOptions<GetColonyExtensionsQuery, GetColonyExtensionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetColonyExtensionsQuery, GetColonyExtensionsQueryVariables>(GetColonyExtensionsDocument, options);
      }
export function useGetColonyExtensionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetColonyExtensionsQuery, GetColonyExtensionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetColonyExtensionsQuery, GetColonyExtensionsQueryVariables>(GetColonyExtensionsDocument, options);
        }
export type GetColonyExtensionsQueryHookResult = ReturnType<typeof useGetColonyExtensionsQuery>;
export type GetColonyExtensionsLazyQueryHookResult = ReturnType<typeof useGetColonyExtensionsLazyQuery>;
export type GetColonyExtensionsQueryResult = Apollo.QueryResult<GetColonyExtensionsQuery, GetColonyExtensionsQueryVariables>;
export const GetColonyExtensionDocument = gql`
    query GetColonyExtension($colonyAddress: ID!, $extensionHash: String!) {
  getExtensionByColonyAndHash(
    colonyId: $colonyAddress
    hash: {eq: $extensionHash}
    filter: {isDeleted: {eq: false}}
  ) {
    items {
      ...Extension
    }
  }
}
    ${ExtensionFragmentDoc}`;

/**
 * __useGetColonyExtensionQuery__
 *
 * To run a query within a React component, call `useGetColonyExtensionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetColonyExtensionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetColonyExtensionQuery({
 *   variables: {
 *      colonyAddress: // value for 'colonyAddress'
 *      extensionHash: // value for 'extensionHash'
 *   },
 * });
 */
export function useGetColonyExtensionQuery(baseOptions: Apollo.QueryHookOptions<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>(GetColonyExtensionDocument, options);
      }
export function useGetColonyExtensionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>(GetColonyExtensionDocument, options);
        }
export type GetColonyExtensionQueryHookResult = ReturnType<typeof useGetColonyExtensionQuery>;
export type GetColonyExtensionLazyQueryHookResult = ReturnType<typeof useGetColonyExtensionLazyQuery>;
export type GetColonyExtensionQueryResult = Apollo.QueryResult<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>;
export const GetMembersForColonyDocument = gql`
    query GetMembersForColony($input: MembersForColonyInput!) {
  getMembersForColony(input: $input) {
    contributors {
      ...Contributor
    }
    watchers {
      ...Watcher
    }
  }
}
    ${ContributorFragmentDoc}
${WatcherFragmentDoc}`;

/**
 * __useGetMembersForColonyQuery__
 *
 * To run a query within a React component, call `useGetMembersForColonyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembersForColonyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembersForColonyQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetMembersForColonyQuery(baseOptions: Apollo.QueryHookOptions<GetMembersForColonyQuery, GetMembersForColonyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMembersForColonyQuery, GetMembersForColonyQueryVariables>(GetMembersForColonyDocument, options);
      }
export function useGetMembersForColonyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMembersForColonyQuery, GetMembersForColonyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMembersForColonyQuery, GetMembersForColonyQueryVariables>(GetMembersForColonyDocument, options);
        }
export type GetMembersForColonyQueryHookResult = ReturnType<typeof useGetMembersForColonyQuery>;
export type GetMembersForColonyLazyQueryHookResult = ReturnType<typeof useGetMembersForColonyLazyQuery>;
export type GetMembersForColonyQueryResult = Apollo.QueryResult<GetMembersForColonyQuery, GetMembersForColonyQueryVariables>;
export const GetMotionStateDocument = gql`
    query GetMotionState($input: GetMotionStateInput!) {
  getMotionState(input: $input)
}
    `;

/**
 * __useGetMotionStateQuery__
 *
 * To run a query within a React component, call `useGetMotionStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMotionStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMotionStateQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetMotionStateQuery(baseOptions: Apollo.QueryHookOptions<GetMotionStateQuery, GetMotionStateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMotionStateQuery, GetMotionStateQueryVariables>(GetMotionStateDocument, options);
      }
export function useGetMotionStateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMotionStateQuery, GetMotionStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMotionStateQuery, GetMotionStateQueryVariables>(GetMotionStateDocument, options);
        }
export type GetMotionStateQueryHookResult = ReturnType<typeof useGetMotionStateQuery>;
export type GetMotionStateLazyQueryHookResult = ReturnType<typeof useGetMotionStateLazyQuery>;
export type GetMotionStateQueryResult = Apollo.QueryResult<GetMotionStateQuery, GetMotionStateQueryVariables>;
export const GetVoterRewardsDocument = gql`
    query GetVoterRewards($input: GetVoterRewardsInput!) {
  getVoterRewards(input: $input) {
    min
    max
    reward
  }
}
    `;

/**
 * __useGetVoterRewardsQuery__
 *
 * To run a query within a React component, call `useGetVoterRewardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVoterRewardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVoterRewardsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetVoterRewardsQuery(baseOptions: Apollo.QueryHookOptions<GetVoterRewardsQuery, GetVoterRewardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVoterRewardsQuery, GetVoterRewardsQueryVariables>(GetVoterRewardsDocument, options);
      }
export function useGetVoterRewardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVoterRewardsQuery, GetVoterRewardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVoterRewardsQuery, GetVoterRewardsQueryVariables>(GetVoterRewardsDocument, options);
        }
export type GetVoterRewardsQueryHookResult = ReturnType<typeof useGetVoterRewardsQuery>;
export type GetVoterRewardsLazyQueryHookResult = ReturnType<typeof useGetVoterRewardsLazyQuery>;
export type GetVoterRewardsQueryResult = Apollo.QueryResult<GetVoterRewardsQuery, GetVoterRewardsQueryVariables>;
export const GetMotionTimeoutPeriodsDocument = gql`
    query GetMotionTimeoutPeriods($input: GetMotionTimeoutPeriodsInput!) {
  getMotionTimeoutPeriods(input: $input) {
    timeLeftToStake
    timeLeftToVote
    timeLeftToReveal
    timeLeftToEscalate
  }
}
    `;

/**
 * __useGetMotionTimeoutPeriodsQuery__
 *
 * To run a query within a React component, call `useGetMotionTimeoutPeriodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMotionTimeoutPeriodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMotionTimeoutPeriodsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetMotionTimeoutPeriodsQuery(baseOptions: Apollo.QueryHookOptions<GetMotionTimeoutPeriodsQuery, GetMotionTimeoutPeriodsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMotionTimeoutPeriodsQuery, GetMotionTimeoutPeriodsQueryVariables>(GetMotionTimeoutPeriodsDocument, options);
      }
export function useGetMotionTimeoutPeriodsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMotionTimeoutPeriodsQuery, GetMotionTimeoutPeriodsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMotionTimeoutPeriodsQuery, GetMotionTimeoutPeriodsQueryVariables>(GetMotionTimeoutPeriodsDocument, options);
        }
export type GetMotionTimeoutPeriodsQueryHookResult = ReturnType<typeof useGetMotionTimeoutPeriodsQuery>;
export type GetMotionTimeoutPeriodsLazyQueryHookResult = ReturnType<typeof useGetMotionTimeoutPeriodsLazyQuery>;
export type GetMotionTimeoutPeriodsQueryResult = Apollo.QueryResult<GetMotionTimeoutPeriodsQuery, GetMotionTimeoutPeriodsQueryVariables>;
export const GetCurrentNetworkInverseFeeDocument = gql`
    query GetCurrentNetworkInverseFee {
  listCurrentNetworkInverseFees(limit: 1) {
    items {
      inverseFee
    }
  }
}
    `;

/**
 * __useGetCurrentNetworkInverseFeeQuery__
 *
 * To run a query within a React component, call `useGetCurrentNetworkInverseFeeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentNetworkInverseFeeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentNetworkInverseFeeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentNetworkInverseFeeQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentNetworkInverseFeeQuery, GetCurrentNetworkInverseFeeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentNetworkInverseFeeQuery, GetCurrentNetworkInverseFeeQueryVariables>(GetCurrentNetworkInverseFeeDocument, options);
      }
export function useGetCurrentNetworkInverseFeeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentNetworkInverseFeeQuery, GetCurrentNetworkInverseFeeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentNetworkInverseFeeQuery, GetCurrentNetworkInverseFeeQueryVariables>(GetCurrentNetworkInverseFeeDocument, options);
        }
export type GetCurrentNetworkInverseFeeQueryHookResult = ReturnType<typeof useGetCurrentNetworkInverseFeeQuery>;
export type GetCurrentNetworkInverseFeeLazyQueryHookResult = ReturnType<typeof useGetCurrentNetworkInverseFeeLazyQuery>;
export type GetCurrentNetworkInverseFeeQueryResult = Apollo.QueryResult<GetCurrentNetworkInverseFeeQuery, GetCurrentNetworkInverseFeeQueryVariables>;
export const GetProfileByEmailDocument = gql`
    query GetProfileByEmail($email: AWSEmail!) {
  getProfileByEmail(email: $email) {
    items {
      id
    }
  }
}
    `;

/**
 * __useGetProfileByEmailQuery__
 *
 * To run a query within a React component, call `useGetProfileByEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileByEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileByEmailQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useGetProfileByEmailQuery(baseOptions: Apollo.QueryHookOptions<GetProfileByEmailQuery, GetProfileByEmailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileByEmailQuery, GetProfileByEmailQueryVariables>(GetProfileByEmailDocument, options);
      }
export function useGetProfileByEmailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileByEmailQuery, GetProfileByEmailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileByEmailQuery, GetProfileByEmailQueryVariables>(GetProfileByEmailDocument, options);
        }
export type GetProfileByEmailQueryHookResult = ReturnType<typeof useGetProfileByEmailQuery>;
export type GetProfileByEmailLazyQueryHookResult = ReturnType<typeof useGetProfileByEmailLazyQuery>;
export type GetProfileByEmailQueryResult = Apollo.QueryResult<GetProfileByEmailQuery, GetProfileByEmailQueryVariables>;
export const GetTokenByAddressDocument = gql`
    query GetTokenByAddress($address: ID!) {
  getTokenByAddress(id: $address) {
    items {
      ...Token
    }
  }
}
    ${TokenFragmentDoc}`;

/**
 * __useGetTokenByAddressQuery__
 *
 * To run a query within a React component, call `useGetTokenByAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenByAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenByAddressQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetTokenByAddressQuery(baseOptions: Apollo.QueryHookOptions<GetTokenByAddressQuery, GetTokenByAddressQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTokenByAddressQuery, GetTokenByAddressQueryVariables>(GetTokenByAddressDocument, options);
      }
export function useGetTokenByAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTokenByAddressQuery, GetTokenByAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTokenByAddressQuery, GetTokenByAddressQueryVariables>(GetTokenByAddressDocument, options);
        }
export type GetTokenByAddressQueryHookResult = ReturnType<typeof useGetTokenByAddressQuery>;
export type GetTokenByAddressLazyQueryHookResult = ReturnType<typeof useGetTokenByAddressLazyQuery>;
export type GetTokenByAddressQueryResult = Apollo.QueryResult<GetTokenByAddressQuery, GetTokenByAddressQueryVariables>;
export const GetTokenFromEverywhereDocument = gql`
    query GetTokenFromEverywhere($input: TokenFromEverywhereArguments!) {
  getTokenFromEverywhere(input: $input) {
    items {
      ...Token
    }
  }
}
    ${TokenFragmentDoc}`;

/**
 * __useGetTokenFromEverywhereQuery__
 *
 * To run a query within a React component, call `useGetTokenFromEverywhereQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenFromEverywhereQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenFromEverywhereQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetTokenFromEverywhereQuery(baseOptions: Apollo.QueryHookOptions<GetTokenFromEverywhereQuery, GetTokenFromEverywhereQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTokenFromEverywhereQuery, GetTokenFromEverywhereQueryVariables>(GetTokenFromEverywhereDocument, options);
      }
export function useGetTokenFromEverywhereLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTokenFromEverywhereQuery, GetTokenFromEverywhereQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTokenFromEverywhereQuery, GetTokenFromEverywhereQueryVariables>(GetTokenFromEverywhereDocument, options);
        }
export type GetTokenFromEverywhereQueryHookResult = ReturnType<typeof useGetTokenFromEverywhereQuery>;
export type GetTokenFromEverywhereLazyQueryHookResult = ReturnType<typeof useGetTokenFromEverywhereLazyQuery>;
export type GetTokenFromEverywhereQueryResult = Apollo.QueryResult<GetTokenFromEverywhereQuery, GetTokenFromEverywhereQueryVariables>;
export const GetUserTokenBalanceDocument = gql`
    query GetUserTokenBalance($input: GetUserTokenBalanceInput!) {
  getUserTokenBalance(input: $input) {
    ...UserTokenBalanceData
  }
}
    ${UserTokenBalanceDataFragmentDoc}`;

/**
 * __useGetUserTokenBalanceQuery__
 *
 * To run a query within a React component, call `useGetUserTokenBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserTokenBalanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserTokenBalanceQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetUserTokenBalanceQuery(baseOptions: Apollo.QueryHookOptions<GetUserTokenBalanceQuery, GetUserTokenBalanceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserTokenBalanceQuery, GetUserTokenBalanceQueryVariables>(GetUserTokenBalanceDocument, options);
      }
export function useGetUserTokenBalanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserTokenBalanceQuery, GetUserTokenBalanceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserTokenBalanceQuery, GetUserTokenBalanceQueryVariables>(GetUserTokenBalanceDocument, options);
        }
export type GetUserTokenBalanceQueryHookResult = ReturnType<typeof useGetUserTokenBalanceQuery>;
export type GetUserTokenBalanceLazyQueryHookResult = ReturnType<typeof useGetUserTokenBalanceLazyQuery>;
export type GetUserTokenBalanceQueryResult = Apollo.QueryResult<GetUserTokenBalanceQuery, GetUserTokenBalanceQueryVariables>;
export const GetUserByAddressDocument = gql`
    query GetUserByAddress($address: ID!) {
  getUserByAddress(id: $address) {
    items {
      ...User
    }
  }
}
    ${UserFragmentDoc}`;

/**
 * __useGetUserByAddressQuery__
 *
 * To run a query within a React component, call `useGetUserByAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByAddressQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetUserByAddressQuery(baseOptions: Apollo.QueryHookOptions<GetUserByAddressQuery, GetUserByAddressQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByAddressQuery, GetUserByAddressQueryVariables>(GetUserByAddressDocument, options);
      }
export function useGetUserByAddressLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByAddressQuery, GetUserByAddressQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByAddressQuery, GetUserByAddressQueryVariables>(GetUserByAddressDocument, options);
        }
export type GetUserByAddressQueryHookResult = ReturnType<typeof useGetUserByAddressQuery>;
export type GetUserByAddressLazyQueryHookResult = ReturnType<typeof useGetUserByAddressLazyQuery>;
export type GetUserByAddressQueryResult = Apollo.QueryResult<GetUserByAddressQuery, GetUserByAddressQueryVariables>;
export const GetUserReputationDocument = gql`
    query GetUserReputation($input: GetUserReputationInput!) {
  getUserReputation(input: $input)
}
    `;

/**
 * __useGetUserReputationQuery__
 *
 * To run a query within a React component, call `useGetUserReputationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserReputationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserReputationQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetUserReputationQuery(baseOptions: Apollo.QueryHookOptions<GetUserReputationQuery, GetUserReputationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserReputationQuery, GetUserReputationQueryVariables>(GetUserReputationDocument, options);
      }
export function useGetUserReputationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserReputationQuery, GetUserReputationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserReputationQuery, GetUserReputationQueryVariables>(GetUserReputationDocument, options);
        }
export type GetUserReputationQueryHookResult = ReturnType<typeof useGetUserReputationQuery>;
export type GetUserReputationLazyQueryHookResult = ReturnType<typeof useGetUserReputationLazyQuery>;
export type GetUserReputationQueryResult = Apollo.QueryResult<GetUserReputationQuery, GetUserReputationQueryVariables>;
export const GetReputationForTopDomainsDocument = gql`
    query GetReputationForTopDomains($input: GetReputationForTopDomainsInput!) {
  getReputationForTopDomains(input: $input) {
    items {
      domainId
      reputationPercentage
    }
  }
}
    `;

/**
 * __useGetReputationForTopDomainsQuery__
 *
 * To run a query within a React component, call `useGetReputationForTopDomainsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReputationForTopDomainsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReputationForTopDomainsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetReputationForTopDomainsQuery(baseOptions: Apollo.QueryHookOptions<GetReputationForTopDomainsQuery, GetReputationForTopDomainsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReputationForTopDomainsQuery, GetReputationForTopDomainsQueryVariables>(GetReputationForTopDomainsDocument, options);
      }
export function useGetReputationForTopDomainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReputationForTopDomainsQuery, GetReputationForTopDomainsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReputationForTopDomainsQuery, GetReputationForTopDomainsQueryVariables>(GetReputationForTopDomainsDocument, options);
        }
export type GetReputationForTopDomainsQueryHookResult = ReturnType<typeof useGetReputationForTopDomainsQuery>;
export type GetReputationForTopDomainsLazyQueryHookResult = ReturnType<typeof useGetReputationForTopDomainsLazyQuery>;
export type GetReputationForTopDomainsQueryResult = Apollo.QueryResult<GetReputationForTopDomainsQuery, GetReputationForTopDomainsQueryVariables>;
export const GetUserByNameDocument = gql`
    query GetUserByName($name: String!) {
  getUserByName(name: $name) {
    items {
      ...User
    }
  }
}
    ${UserFragmentDoc}`;

/**
 * __useGetUserByNameQuery__
 *
 * To run a query within a React component, call `useGetUserByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetUserByNameQuery(baseOptions: Apollo.QueryHookOptions<GetUserByNameQuery, GetUserByNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByNameQuery, GetUserByNameQueryVariables>(GetUserByNameDocument, options);
      }
export function useGetUserByNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByNameQuery, GetUserByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByNameQuery, GetUserByNameQueryVariables>(GetUserByNameDocument, options);
        }
export type GetUserByNameQueryHookResult = ReturnType<typeof useGetUserByNameQuery>;
export type GetUserByNameLazyQueryHookResult = ReturnType<typeof useGetUserByNameLazyQuery>;
export type GetUserByNameQueryResult = Apollo.QueryResult<GetUserByNameQuery, GetUserByNameQueryVariables>;
export const CombinedUserDocument = gql`
    query CombinedUser($name: String!, $address: ID!) {
  getUserByAddress(id: $address) {
    items {
      ...User
    }
  }
  getUserByName(name: $name) {
    items {
      ...User
    }
  }
}
    ${UserFragmentDoc}`;

/**
 * __useCombinedUserQuery__
 *
 * To run a query within a React component, call `useCombinedUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCombinedUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCombinedUserQuery({
 *   variables: {
 *      name: // value for 'name'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useCombinedUserQuery(baseOptions: Apollo.QueryHookOptions<CombinedUserQuery, CombinedUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CombinedUserQuery, CombinedUserQueryVariables>(CombinedUserDocument, options);
      }
export function useCombinedUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CombinedUserQuery, CombinedUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CombinedUserQuery, CombinedUserQueryVariables>(CombinedUserDocument, options);
        }
export type CombinedUserQueryHookResult = ReturnType<typeof useCombinedUserQuery>;
export type CombinedUserLazyQueryHookResult = ReturnType<typeof useCombinedUserLazyQuery>;
export type CombinedUserQueryResult = Apollo.QueryResult<CombinedUserQuery, CombinedUserQueryVariables>;
export const GetUsersDocument = gql`
    query GetUsers($filter: ModelUserFilterInput) {
  listUsers(filter: $filter) {
    items {
      ...User
    }
  }
}
    ${UserFragmentDoc}`;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const GetCurrentExtensionsVersionsDocument = gql`
    query GetCurrentExtensionsVersions {
  listCurrentVersions {
    items {
      extensionHash: key
      version
    }
  }
}
    `;

/**
 * __useGetCurrentExtensionsVersionsQuery__
 *
 * To run a query within a React component, call `useGetCurrentExtensionsVersionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentExtensionsVersionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentExtensionsVersionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentExtensionsVersionsQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentExtensionsVersionsQuery, GetCurrentExtensionsVersionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentExtensionsVersionsQuery, GetCurrentExtensionsVersionsQueryVariables>(GetCurrentExtensionsVersionsDocument, options);
      }
export function useGetCurrentExtensionsVersionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentExtensionsVersionsQuery, GetCurrentExtensionsVersionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentExtensionsVersionsQuery, GetCurrentExtensionsVersionsQueryVariables>(GetCurrentExtensionsVersionsDocument, options);
        }
export type GetCurrentExtensionsVersionsQueryHookResult = ReturnType<typeof useGetCurrentExtensionsVersionsQuery>;
export type GetCurrentExtensionsVersionsLazyQueryHookResult = ReturnType<typeof useGetCurrentExtensionsVersionsLazyQuery>;
export type GetCurrentExtensionsVersionsQueryResult = Apollo.QueryResult<GetCurrentExtensionsVersionsQuery, GetCurrentExtensionsVersionsQueryVariables>;
export const GetCurrentExtensionVersionDocument = gql`
    query GetCurrentExtensionVersion($extensionHash: String!) {
  getCurrentVersionByKey(key: $extensionHash) {
    items {
      extensionHash: key
      version
    }
  }
}
    `;

/**
 * __useGetCurrentExtensionVersionQuery__
 *
 * To run a query within a React component, call `useGetCurrentExtensionVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentExtensionVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentExtensionVersionQuery({
 *   variables: {
 *      extensionHash: // value for 'extensionHash'
 *   },
 * });
 */
export function useGetCurrentExtensionVersionQuery(baseOptions: Apollo.QueryHookOptions<GetCurrentExtensionVersionQuery, GetCurrentExtensionVersionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentExtensionVersionQuery, GetCurrentExtensionVersionQueryVariables>(GetCurrentExtensionVersionDocument, options);
      }
export function useGetCurrentExtensionVersionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentExtensionVersionQuery, GetCurrentExtensionVersionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentExtensionVersionQuery, GetCurrentExtensionVersionQueryVariables>(GetCurrentExtensionVersionDocument, options);
        }
export type GetCurrentExtensionVersionQueryHookResult = ReturnType<typeof useGetCurrentExtensionVersionQuery>;
export type GetCurrentExtensionVersionLazyQueryHookResult = ReturnType<typeof useGetCurrentExtensionVersionLazyQuery>;
export type GetCurrentExtensionVersionQueryResult = Apollo.QueryResult<GetCurrentExtensionVersionQuery, GetCurrentExtensionVersionQueryVariables>;
export const GetCurrentColonyVersionDocument = gql`
    query GetCurrentColonyVersion {
  getCurrentVersionByKey(key: "colony") {
    items {
      version
    }
  }
}
    `;

/**
 * __useGetCurrentColonyVersionQuery__
 *
 * To run a query within a React component, call `useGetCurrentColonyVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentColonyVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentColonyVersionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentColonyVersionQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentColonyVersionQuery, GetCurrentColonyVersionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentColonyVersionQuery, GetCurrentColonyVersionQueryVariables>(GetCurrentColonyVersionDocument, options);
      }
export function useGetCurrentColonyVersionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentColonyVersionQuery, GetCurrentColonyVersionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentColonyVersionQuery, GetCurrentColonyVersionQueryVariables>(GetCurrentColonyVersionDocument, options);
        }
export type GetCurrentColonyVersionQueryHookResult = ReturnType<typeof useGetCurrentColonyVersionQuery>;
export type GetCurrentColonyVersionLazyQueryHookResult = ReturnType<typeof useGetCurrentColonyVersionLazyQuery>;
export type GetCurrentColonyVersionQueryResult = Apollo.QueryResult<GetCurrentColonyVersionQuery, GetCurrentColonyVersionQueryVariables>;