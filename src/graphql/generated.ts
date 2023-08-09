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

/** Defines an annotation for actions, motions and decisions */
export type Annotation = {
  __typename?: 'Annotation';
  /** The id of the action it annotates */
  actionId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /** The id of the annotation. */
  id: Scalars['ID'];
  /** The IPFS hash, if the annotation was also uploaded to IPFS */
  ipfsHash?: Maybe<Scalars['String']>;
  /** The actual annotation message */
  message: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

/**
 * Represents metadata related to a blockchain event
 * Applies to Colonies, Tokens and Events, but not all fields are revlant to all
 * It does not apply to user accounts as they can live on all networks
 */
export type ChainMetadata = {
  __typename?: 'ChainMetadata';
  /** The block number of the event */
  blockNumber?: Maybe<Scalars['Int']>;
  /** The chain ID of the event */
  chainId: Scalars['Int'];
  /** The log index of the event */
  logIndex?: Maybe<Scalars['Int']>;
  /** The network the event occurred on */
  network?: Maybe<Network>;
  /** The transaction hash of the event */
  transactionHash?: Maybe<Scalars['String']>;
};

/** Input data for relevant chain metadata of a Colony (if applicable) */
export type ChainMetadataInput = {
  /** The block number of the creation transaction */
  blockNumber?: InputMaybe<Scalars['Int']>;
  /** The chain ID of the network */
  chainId: Scalars['Int'];
  /** The log index of the creation transaction */
  logIndex?: InputMaybe<Scalars['Int']>;
  /** The network the Colony is deployed on */
  network?: InputMaybe<Network>;
  /** The transaction hash of the creation transaction */
  transactionHash?: InputMaybe<Scalars['String']>;
};

/** Represents a Colony within the Colony Network */
export type Colony = {
  __typename?: 'Colony';
  actions?: Maybe<ModelColonyActionConnection>;
  /** Returns a list token balances for each domain and each token that the colony has */
  balances?: Maybe<ColonyBalances>;
  /** List of native chain token claims (e.g., Token 0x0000...0000: ETH, xDAI, etc.) */
  chainFundsClaim?: Maybe<ColonyChainFundsClaim>;
  /** Metadata related to the chain of the Colony */
  chainMetadata: ChainMetadata;
  createdAt: Scalars['AWSDateTime'];
  domains?: Maybe<ModelDomainConnection>;
  expenditures?: Maybe<ModelExpenditureConnection>;
  expendituresGlobalClaimDelay?: Maybe<Scalars['Int']>;
  extensions?: Maybe<ModelColonyExtensionConnection>;
  fundsClaims?: Maybe<ModelColonyFundsClaimConnection>;
  /** Unique identifier for the Colony (contract address) */
  id: Scalars['ID'];
  /** Metadata of the Colony */
  metadata?: Maybe<ColonyMetadata>;
  /** List of motions within the Colony that have unclaimed stakes */
  motionsWithUnclaimedStakes?: Maybe<Array<ColonyUnclaimedStake>>;
  /** (Short) name of the Colony */
  name: Scalars['String'];
  /** The native token of the Colony */
  nativeToken: Token;
  /** The unique address of the native token of the Colony */
  nativeTokenId: Scalars['ID'];
  roles?: Maybe<ModelColonyRoleConnection>;
  /** Status information for the Colony */
  status?: Maybe<ColonyStatus>;
  tokens?: Maybe<ModelColonyTokensConnection>;
  /** Type of the Colony (Regular or Metacolony) */
  type?: Maybe<ColonyType>;
  updatedAt: Scalars['AWSDateTime'];
  /** Version of the Colony */
  version: Scalars['Int'];
  watchers?: Maybe<ModelWatchedColoniesConnection>;
};


/** Represents a Colony within the Colony Network */
export type ColonyActionsArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents a Colony within the Colony Network */
export type ColonyDomainsArgs = {
  filter?: InputMaybe<ModelDomainFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents a Colony within the Colony Network */
export type ColonyExpendituresArgs = {
  filter?: InputMaybe<ModelExpenditureFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents a Colony within the Colony Network */
export type ColonyExtensionsArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents a Colony within the Colony Network */
export type ColonyFundsClaimsArgs = {
  filter?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents a Colony within the Colony Network */
export type ColonyRolesArgs = {
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents a Colony within the Colony Network */
export type ColonyTokensArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents a Colony within the Colony Network */
export type ColonyWatchersArgs = {
  filter?: InputMaybe<ModelWatchedColoniesFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Represents an action performed within a Colony */
export type ColonyAction = {
  __typename?: 'ColonyAction';
  /** The amount involved in the action, if applicable */
  amount?: Maybe<Scalars['String']>;
  /** The annotation associated with the action, if there is one */
  annotation?: Maybe<Annotation>;
  /** The id of the associated annotation, if there is one */
  annotationId?: Maybe<Scalars['ID']>;
  /** The block number where the action was recorded */
  blockNumber: Scalars['Int'];
  /** The Colony that the action belongs to */
  colony: Colony;
  colonyActionsId?: Maybe<Scalars['ID']>;
  /** The identifier of the Colony that the action belongs to */
  colonyId: Scalars['ID'];
  /** The timestamp when the action was created */
  createdAt: Scalars['AWSDateTime'];
  /** The source Domain of the action, if applicable */
  fromDomain?: Maybe<Domain>;
  /** The source Domain identifier, if applicable */
  fromDomainId?: Maybe<Scalars['ID']>;
  /** The fundamental chain id */
  fundamentalChainId?: Maybe<Scalars['Int']>;
  /** Unique identifier for the ColonyAction */
  id: Scalars['ID'];
  /** JSON string to pass custom, dynamic event data */
  individualEvents?: Maybe<Scalars['String']>;
  /** The Ethereum address of the action initiator. Can be a user, extension or colony */
  initiatorAddress: Scalars['ID'];
  /** The Colony that initiated the action, if applicable */
  initiatorColony?: Maybe<Colony>;
  /** The ColonyExtension that initiated the action, if applicable */
  initiatorExtension?: Maybe<ColonyExtension>;
  /** The Token contract that initiated the action, if applicable */
  initiatorToken?: Maybe<Token>;
  /** The User who initiated the action, if applicable */
  initiatorUser?: Maybe<User>;
  isMotion?: Maybe<Scalars['Boolean']>;
  /** Expanded `ColonyMotion` for the corresponding `motionId` */
  motionData?: Maybe<ColonyMotion>;
  /** Corresponding domainId of the motion */
  motionDomainId?: Maybe<Scalars['Int']>;
  /** The internal database id of the motion */
  motionId?: Maybe<Scalars['ID']>;
  /** The resulting new Colony version, if applicable */
  newColonyVersion?: Maybe<Scalars['Int']>;
  /** Colony metadata that is stored temporarily and commited to the database once the corresponding motion passes */
  pendingColonyMetadata?: Maybe<ColonyMetadata>;
  /** Identifier of Colony metadata that is stored temporarily and commited to the database once the corresponding motion passes */
  pendingColonyMetadataId?: Maybe<Scalars['ID']>;
  /** Domain metadata that is stored temporarily and commited to the database once the corresponding motion passes */
  pendingDomainMetadata?: Maybe<DomainMetadata>;
  /** Identifier of domain metadata that is stored temporarily and commited to the database once the corresponding motion passes */
  pendingDomainMetadataId?: Maybe<Scalars['ID']>;
  /** The address of the action recipient, if applicable */
  recipientAddress?: Maybe<Scalars['ID']>;
  /** The corresponding Colony which was involved the action, if applicable */
  recipientColony?: Maybe<Colony>;
  /** The corresponding extension which was involved the action, if applicable */
  recipientExtension?: Maybe<ColonyExtension>;
  /** The address of the token that was received the action, if applicable */
  recipientToken?: Maybe<Token>;
  /** The User who received the action, if applicable */
  recipientUser?: Maybe<User>;
  /** Colony roles that are associated with the action */
  roles?: Maybe<ColonyActionRoles>;
  /**
   * Whether to show the motion in the actions list
   * True for (forced) actions. True for motions if staked above 10%
   */
  showInActionsList: Scalars['Boolean'];
  /** The target Domain of the action, if applicable */
  toDomain?: Maybe<Domain>;
  /** The target Domain identifier, if applicable */
  toDomainId?: Maybe<Scalars['ID']>;
  /** The Token involved in the action, if applicable */
  token?: Maybe<Token>;
  /** The Ethereum address of the token involved in the action, if applicable */
  tokenAddress?: Maybe<Scalars['ID']>;
  /** The type of action performed */
  type: ColonyActionType;
  updatedAt: Scalars['AWSDateTime'];
};

/** Colony Roles that can be involved in an action */
export type ColonyActionRoles = {
  __typename?: 'ColonyActionRoles';
  /** Recovery role */
  role_0?: Maybe<Scalars['Boolean']>;
  /** Root role */
  role_1?: Maybe<Scalars['Boolean']>;
  /** Arbitration role */
  role_2?: Maybe<Scalars['Boolean']>;
  /** Architecture role */
  role_3?: Maybe<Scalars['Boolean']>;
  /** Funding role */
  role_5?: Maybe<Scalars['Boolean']>;
  /** Administration role */
  role_6?: Maybe<Scalars['Boolean']>;
};

export type ColonyActionRolesInput = {
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
};

/**
 * Variants of Colony Network blockchain events
 *
 * These can all happen in a Colony and will be interpreted by the dApp according to their types
 */
export enum ColonyActionType {
  /** An action related to editing a Colony's details */
  ColonyEdit = 'COLONY_EDIT',
  /** An action related to editing a Colony's details via a motion */
  ColonyEditMotion = 'COLONY_EDIT_MOTION',
  /** An action related to creating a domain within a Colony */
  CreateDomain = 'CREATE_DOMAIN',
  /** An action related to creating a domain within a Colony via a motion */
  CreateDomainMotion = 'CREATE_DOMAIN_MOTION',
  /** An action related to editing a domain's details */
  EditDomain = 'EDIT_DOMAIN',
  /** An action related to editing a domain's details via a motion */
  EditDomainMotion = 'EDIT_DOMAIN_MOTION',
  /** An action related to a domain reputation penalty within a Colony (smite) */
  EmitDomainReputationPenalty = 'EMIT_DOMAIN_REPUTATION_PENALTY',
  /** An action related to a domain reputation penalty within a Colony (smite) via a motion */
  EmitDomainReputationPenaltyMotion = 'EMIT_DOMAIN_REPUTATION_PENALTY_MOTION',
  /** An action related to a domain reputation reward within a Colony */
  EmitDomainReputationReward = 'EMIT_DOMAIN_REPUTATION_REWARD',
  /** An action related to a domain reputation reward within a Colony via a motion */
  EmitDomainReputationRewardMotion = 'EMIT_DOMAIN_REPUTATION_REWARD_MOTION',
  /** A generic or unspecified Colony action */
  Generic = 'GENERIC',
  /** An action related to minting tokens within a Colony */
  MintTokens = 'MINT_TOKENS',
  /** An action related to minting tokens within a Colony via a motion */
  MintTokensMotion = 'MINT_TOKENS_MOTION',
  /** An action related to moving funds between domains */
  MoveFunds = 'MOVE_FUNDS',
  /** An action related to moving funds between domains via a motion */
  MoveFundsMotion = 'MOVE_FUNDS_MOTION',
  /** An motion action placeholder that should not be used */
  NullMotion = 'NULL_MOTION',
  /** An action related to a payment within a Colony */
  Payment = 'PAYMENT',
  /** An action related to a payment that was created via a motion within a Colony */
  PaymentMotion = 'PAYMENT_MOTION',
  /** An action related to the recovery functionality of a Colony */
  Recovery = 'RECOVERY',
  /** An action related to setting user roles within a Colony */
  SetUserRoles = 'SET_USER_ROLES',
  /** An action related to setting user roles within a Colony via a motion */
  SetUserRolesMotion = 'SET_USER_ROLES_MOTION',
  /** An action related to unlocking a token within a Colony */
  UnlockToken = 'UNLOCK_TOKEN',
  /** An action related to unlocking a token within a Colony via a motion */
  UnlockTokenMotion = 'UNLOCK_TOKEN_MOTION',
  /** An action related to upgrading a Colony's version */
  VersionUpgrade = 'VERSION_UPGRADE',
  /** An action related to upgrading a Colony's version via a motion */
  VersionUpgradeMotion = 'VERSION_UPGRADE_MOTION',
  /** An action unrelated to the currently viewed Colony */
  WrongColony = 'WRONG_COLONY'
}

/** Represents a Colony balance for a specific domain and token */
export type ColonyBalance = {
  __typename?: 'ColonyBalance';
  /** Balance of the specific token in the domain */
  balance: Scalars['String'];
  /** Domain associated with the Colony Balance */
  domain?: Maybe<Domain>;
  /** Unique identifier for the Colony Balance */
  id: Scalars['ID'];
  /**
   * Token associated with the Colony Balance
   * Note that for the chain native token, name and symbol are empty
   */
  token: Token;
};

export type ColonyBalanceInput = {
  balance: Scalars['String'];
  domain?: InputMaybe<DomainInput>;
  id?: InputMaybe<Scalars['ID']>;
  token: TokenInput;
};

/** Represents a collection of Colony balances */
export type ColonyBalances = {
  __typename?: 'ColonyBalances';
  /** List of Colony balances */
  items?: Maybe<Array<Maybe<ColonyBalance>>>;
};

export type ColonyBalancesInput = {
  items?: InputMaybe<Array<InputMaybe<ColonyBalanceInput>>>;
};

/**
 * Represents a native Colony Chain Funds Claim
 * E.g., Token 0x0000...0000: ETH, xDAI, etc
 */
export type ColonyChainFundsClaim = {
  __typename?: 'ColonyChainFundsClaim';
  /** Amount claimed in the Colony Chain Funds Claim */
  amount: Scalars['String'];
  /** Timestamp when the Chain Funds Claim was created */
  createdAt: Scalars['AWSDateTime'];
  /** Block number when the Chain Funds Claim was created */
  createdAtBlock: Scalars['Int'];
  /** Unique identifier for the Colony Chain Funds Claim */
  id: Scalars['ID'];
  /** Timestamp when the Chain Funds Claim was last updated */
  updatedAt: Scalars['AWSDateTime'];
};

export type ColonyChainFundsClaimInput = {
  amount: Scalars['String'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  createdAtBlock: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
};

/** Represents a single extension installed on a Colony */
export type ColonyExtension = {
  __typename?: 'ColonyExtension';
  /** The Colony that the extension belongs to */
  colony: Colony;
  /** The identifier of the Colony that the extension belongs to (the Colony's address) */
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /**
   * The unique hash of the extension
   * The hash is generated like so: `keccak256(toUtf8Bytes(extensionName))`, where `extensionName` is the name of the extension contract file in the Colony Network
   */
  hash: Scalars['String'];
  /** Unique identifier for the ColonyExtension */
  id: Scalars['ID'];
  /** The timestamp when the extension was installed */
  installedAt: Scalars['AWSTimestamp'];
  /** The address of the user who installed the extension */
  installedBy: Scalars['String'];
  /** Indicates whether the extension has been removed */
  isDeleted: Scalars['Boolean'];
  /** Indicates whether the extension is deprecated */
  isDeprecated: Scalars['Boolean'];
  /** Indicates whether the extension has been initialized */
  isInitialized: Scalars['Boolean'];
  /** Map of parameters that extension was initialised with */
  params?: Maybe<ExtensionParams>;
  updatedAt: Scalars['AWSDateTime'];
  /** The version number of the extension */
  version: Scalars['Int'];
};

/** Represents a Colony Funds Claim for all ERC20 tokens (except native chain tokens) */
export type ColonyFundsClaim = {
  __typename?: 'ColonyFundsClaim';
  /** Amount claimed in the Colony Funds Claim */
  amount: Scalars['String'];
  colonyFundsClaimTokenId: Scalars['ID'];
  colonyFundsClaimsId?: Maybe<Scalars['ID']>;
  /** Timestamp when the Funds Claim was created */
  createdAt: Scalars['AWSDateTime'];
  /** Block number when the Funds Claim was created */
  createdAtBlock: Scalars['Int'];
  /** Unique identifier for the Colony Funds Claim */
  id: Scalars['ID'];
  /** Token associated with the Colony Funds Claim */
  token: Token;
  updatedAt: Scalars['AWSDateTime'];
};

/**
 * "
 * Snapshot of the user's full roles/permissions at a specific block
 */
export type ColonyHistoricRole = {
  __typename?: 'ColonyHistoricRole';
  /** Block at which the snapshot was taken */
  blockNumber: Scalars['Int'];
  /** Expanded `Colony` model, based on the `colonyId` given */
  colony: Colony;
  /** Unique identifier of the Colony */
  colonyId: Scalars['ID'];
  /** Timestamp at which the database entry was created */
  createdAt: Scalars['AWSDateTime'];
  /** Expanded `Domain` model, based on the `domainId` given */
  domain: Domain;
  /** Unique identifier of the domain */
  domainId: Scalars['ID'];
  /**
   * Unique identifier for the role snapshot
   * Format: `colonyAddress_domainNativeId_userAddress_blockNumber_roles`
   */
  id: Scalars['ID'];
  /** Recovery role */
  role_0?: Maybe<Scalars['Boolean']>;
  /** Root role */
  role_1?: Maybe<Scalars['Boolean']>;
  /** Arbitration role */
  role_2?: Maybe<Scalars['Boolean']>;
  /** Architecture role */
  role_3?: Maybe<Scalars['Boolean']>;
  /** Funding role */
  role_5?: Maybe<Scalars['Boolean']>;
  /** Administration role */
  role_6?: Maybe<Scalars['Boolean']>;
  /** Address of the agent the permission was set for */
  targetAddress?: Maybe<Scalars['ID']>;
  /** Will expand to a `Colony` model if permission was set for another Colony */
  targetColony?: Maybe<Colony>;
  /** Will expand to a `ColonyExtension` model if permission was set for a Colony extension */
  targetExtension?: Maybe<ColonyExtension>;
  /** Will expand to a `Token` model if permission was set for a Token contract */
  targetToken?: Maybe<Token>;
  /** Will expand to a `User` model if permission was set for a user */
  targetUser?: Maybe<User>;
  /** Used for amplify sorting. Set to `SortedHistoricRole` */
  type: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Represents metadata for a Colony */
export type ColonyMetadata = {
  __typename?: 'ColonyMetadata';
  /** URL of the Colony's avatar image */
  avatar?: Maybe<Scalars['String']>;
  /** List of Colony metadata changelog entries */
  changelog?: Maybe<Array<ColonyMetadataChangelog>>;
  createdAt: Scalars['AWSDateTime'];
  /** Display name of the Colony */
  displayName: Scalars['String'];
  /** Unique identifier for the Colony (contract address) */
  id: Scalars['ID'];
  /** The address book feature (aka Whitelist is active for this Colony) */
  isWhitelistActivated?: Maybe<Scalars['Boolean']>;
  /**
   * Token addresses that were modified in a previous action (motion)
   * Only present on pendingColonyMetadata for consumption in block ingestor
   */
  modifiedTokenAddresses?: Maybe<PendingModifiedTokenAddresses>;
  /** URL of the Colony's thumbnail image */
  thumbnail?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
  /** List of addresses that are in the address book */
  whitelistedAddresses?: Maybe<Array<Scalars['String']>>;
};

/**
 * Represents a changelog entry for Colony metadata
 * This is used to traverse through the history of metadata values and consolidate them into a final state
 */
export type ColonyMetadataChangelog = {
  __typename?: 'ColonyMetadataChangelog';
  /** Indicates whether the avatar has changed */
  hasAvatarChanged: Scalars['Boolean'];
  /** Whether entries in the address book (whitelist) have changed */
  hasWhitelistChanged: Scalars['Boolean'];
  /** Whether tokens have been added or removed from the Colony's token list */
  haveTokensChanged: Scalars['Boolean'];
  /** Display name of the Colony after the change */
  newDisplayName: Scalars['String'];
  /** Display name of the Colony before the change */
  oldDisplayName: Scalars['String'];
  /** Transaction hash associated with the changelog entry */
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

/** Represents a Motion within a Colony */
export type ColonyMotion = {
  __typename?: 'ColonyMotion';
  createdAt: Scalars['AWSDateTime'];
  /**
   * Address of the VotingReputation extension
   * Useful to check if we're viewing a "read-only" motion
   */
  createdBy: Scalars['String'];
  /** Simple flag indicating whether both sides of staking have been activated */
  hasObjection: Scalars['Boolean'];
  /**
   * The internal database id of the motion
   * To ensure uniqueness, we format as: `chainId-votingRepExtnAddress_nativeMotionId`
   */
  id: Scalars['ID'];
  /** Whether the motion was finalized or not */
  isFinalized: Scalars['Boolean'];
  messages?: Maybe<ModelMotionMessageConnection>;
  /** Expanded domain in which the motion was created */
  motionDomain: Domain;
  /** Unique identifier of the motions domain in the database */
  motionDomainId: Scalars['ID'];
  /** Staked sides of a motion */
  motionStakes: MotionStakes;
  /** Quick access flages to check the current state of a motion in its lifecycle */
  motionStateHistory: MotionStateHistory;
  /** The on chain id of the domain associated with the motion */
  nativeMotionDomainId: Scalars['String'];
  /** The on chain id of the motion */
  nativeMotionId: Scalars['String'];
  /** The annotation object associated with the objection to the motion, if any */
  objectionAnnotation?: Maybe<Annotation>;
  /** Id of the associated objection annotation, if any */
  objectionAnnotationId?: Maybe<Scalars['ID']>;
  /**
   * Stakes remaining to activate either side of the motion
   * It's a tuple: `[nayRemaining, yayRemaining]`
   */
  remainingStakes: Array<Scalars['String']>;
  /** The amount of reputation that has submitted a vote */
  repSubmitted: Scalars['String'];
  /** The total required stake for one side to be activated */
  requiredStake: Scalars['String'];
  /** Total voting outcome for the motion (accumulated votes) */
  revealedVotes: MotionStakes;
  /**
   * The reputation root hash at the time of the creation of the motion
   * Used for calculating a user's max stake in client
   */
  rootHash: Scalars['String'];
  /** The total amount of reputation (among all users) that can vote for this motion */
  skillRep: Scalars['String'];
  /** List of staker rewards users will be receiving for a motion */
  stakerRewards: Array<StakerRewards>;
  updatedAt: Scalars['AWSDateTime'];
  /** The minimum stake that a user has to provide for it to be accepted */
  userMinStake: Scalars['String'];
  /** List of stakes that users have made for a motion */
  usersStakes: Array<UserStakes>;
  /** A list of all of the votes cast within in the motion */
  voterRecord: Array<VoterRecord>;
};


/** Represents a Motion within a Colony */
export type ColonyMotionMessagesArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelMotionMessageFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** A snapshot of the current set of permissions a given address has in a given domain within a Colony */
export type ColonyRole = {
  __typename?: 'ColonyRole';
  colonyRolesId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  /** Expaneded `Domain` model, based on the `domainId` given */
  domain: Domain;
  /** Unique identifier of the domain */
  domainId: Scalars['ID'];
  /**
   * Unique identifier for the role snapshot
   * Format: `<colonyAddress>_<domainNativeId>_<userAddress>_roles`
   */
  id: Scalars['ID'];
  /** Block at which permissions were update last */
  latestBlock: Scalars['Int'];
  /** Recovery role */
  role_0?: Maybe<Scalars['Boolean']>;
  /** Root role */
  role_1?: Maybe<Scalars['Boolean']>;
  /** Arbitration role */
  role_2?: Maybe<Scalars['Boolean']>;
  /** Architecture role */
  role_3?: Maybe<Scalars['Boolean']>;
  /** Funding role */
  role_5?: Maybe<Scalars['Boolean']>;
  /** Administration role */
  role_6?: Maybe<Scalars['Boolean']>;
  /** Address of the agent the permission was set for */
  targetAddress?: Maybe<Scalars['ID']>;
  /** Will expand to a `Colony` model if permission was set for another Colony */
  targetColony?: Maybe<Colony>;
  /** Will expand to a `ColonyExtension` model if permission was set for a Colony extension */
  targetExtension?: Maybe<ColonyExtension>;
  /** Will expand to a `Token` model if permission was set for a Token contract */
  targetToken?: Maybe<Token>;
  /** Will expand to a `User` model if permission was set for a user */
  targetUser?: Maybe<User>;
  updatedAt: Scalars['AWSDateTime'];
};

/**
 * Keeps track of the current amount a user has staked in a colony
 * When a user stakes, totalAmount increases. When a user reclaims their stake, totalAmount decreases.
 */
export type ColonyStake = {
  __typename?: 'ColonyStake';
  /** Unique identifier for the Colony */
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /**
   * Unique identifier for the stake
   * Format: `<userId>_<colonyId>`
   */
  id: Scalars['ID'];
  /** Total staked amount */
  totalAmount: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  /** Unique identifier for the user */
  userId: Scalars['ID'];
};

/**
 * Represents the status of a Colony
 *
 * This contains important meta information about the Colony's token and other fundamental settings
 */
export type ColonyStatus = {
  __typename?: 'ColonyStatus';
  /** Status information for the Colony's native token */
  nativeToken?: Maybe<NativeTokenStatus>;
  /** Whether the Colony is in recovery mode */
  recovery?: Maybe<Scalars['Boolean']>;
};

/**
 * Input data for a Colony's status information
 *
 * This is set when a Colony is created and can be changed later
 */
export type ColonyStatusInput = {
  /** Status information for the Colony's native token */
  nativeToken?: InputMaybe<NativeTokenStatusInput>;
  /** Whether the Colony is in recovery mode */
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

/** Variants of Colony types */
export enum ColonyType {
  /** A regular Colony */
  Colony = 'COLONY',
  /** The MetaColony, which governs the entire Colony Network */
  Metacolony = 'METACOLONY'
}

/** Unclaimed staking rewards for a motion */
export type ColonyUnclaimedStake = {
  __typename?: 'ColonyUnclaimedStake';
  /** The on chain id of the motion */
  motionId: Scalars['String'];
  /** List of unclaimed staking rewards for that motion */
  unclaimedRewards: Array<StakerRewards>;
};

export type ColonyUnclaimedStakeInput = {
  motionId: Scalars['String'];
  unclaimedRewards: Array<StakerRewardsInput>;
};

/** Represents an event triggered by a smart contract within the Colony Network */
export type ContractEvent = {
  __typename?: 'ContractEvent';
  /** Address of the agent who initiated the event */
  agent: Scalars['String'];
  /** Metadata associated with the event's chain */
  chainMetadata: ChainMetadata;
  /** Optional association with a Colony */
  colony?: Maybe<Colony>;
  contractEventColonyId?: Maybe<Scalars['ID']>;
  contractEventDomainId?: Maybe<Scalars['ID']>;
  contractEventTokenId?: Maybe<Scalars['ID']>;
  contractEventUserId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  /** Optional association with a Domain */
  domain?: Maybe<Domain>;
  /** Optional encoded arguments as a JSON string */
  encodedArguments?: Maybe<Scalars['String']>;
  /** Unique identifier for the Contract Event, in the format chainID_transactionHash_logIndex */
  id: Scalars['ID'];
  /** Name of the event */
  name: Scalars['String'];
  /** The unique signature of the event */
  signature: Scalars['String'];
  /** Address of the target contract on the receiving end of the event */
  target: Scalars['String'];
  /** Optional association with a Token */
  token?: Maybe<Token>;
  updatedAt: Scalars['AWSDateTime'];
  /** Optional association with a User */
  user?: Maybe<User>;
};

/**
 * Represents a contributor within the Colony Network
 *
 * A contributor is a Colony member who has reputation
 */
export type Contributor = {
  __typename?: 'Contributor';
  /** Wallet address of the contributor */
  address: Scalars['String'];
  /** Reputation amount of the contributor (as an absolute number) */
  reputationAmount?: Maybe<Scalars['String']>;
  /** Reputation percentage of the contributor (of all reputation within the Colony) */
  reputationPercentage?: Maybe<Scalars['String']>;
  /** User data associated with the contributor */
  user?: Maybe<User>;
};

export type CreateAnnotationInput = {
  actionId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  ipfsHash?: InputMaybe<Scalars['String']>;
  message: Scalars['String'];
};

export type CreateColonyActionInput = {
  amount?: InputMaybe<Scalars['String']>;
  annotationId?: InputMaybe<Scalars['ID']>;
  blockNumber: Scalars['Int'];
  colonyActionsId?: InputMaybe<Scalars['ID']>;
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  fromDomainId?: InputMaybe<Scalars['ID']>;
  fundamentalChainId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  individualEvents?: InputMaybe<Scalars['String']>;
  initiatorAddress: Scalars['ID'];
  isMotion?: InputMaybe<Scalars['Boolean']>;
  motionDomainId?: InputMaybe<Scalars['Int']>;
  motionId?: InputMaybe<Scalars['ID']>;
  newColonyVersion?: InputMaybe<Scalars['Int']>;
  pendingColonyMetadataId?: InputMaybe<Scalars['ID']>;
  pendingDomainMetadataId?: InputMaybe<Scalars['ID']>;
  recipientAddress?: InputMaybe<Scalars['ID']>;
  roles?: InputMaybe<ColonyActionRolesInput>;
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

export type CreateColonyHistoricRoleInput = {
  blockNumber: Scalars['Int'];
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  domainId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
  targetAddress?: InputMaybe<Scalars['ID']>;
  type: Scalars['String'];
};

export type CreateColonyInput = {
  balances?: InputMaybe<ColonyBalancesInput>;
  chainFundsClaim?: InputMaybe<ColonyChainFundsClaimInput>;
  chainMetadata: ChainMetadataInput;
  expendituresGlobalClaimDelay?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  motionsWithUnclaimedStakes?: InputMaybe<Array<ColonyUnclaimedStakeInput>>;
  name: Scalars['String'];
  nativeTokenId: Scalars['ID'];
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

export type CreateColonyMotionInput = {
  createdBy: Scalars['String'];
  hasObjection: Scalars['Boolean'];
  id?: InputMaybe<Scalars['ID']>;
  isFinalized: Scalars['Boolean'];
  motionDomainId: Scalars['ID'];
  motionStakes: MotionStakesInput;
  motionStateHistory: MotionStateHistoryInput;
  nativeMotionDomainId: Scalars['String'];
  nativeMotionId: Scalars['String'];
  objectionAnnotationId?: InputMaybe<Scalars['ID']>;
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

export type CreateColonyRoleInput = {
  colonyRolesId?: InputMaybe<Scalars['ID']>;
  domainId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  latestBlock: Scalars['Int'];
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
  targetAddress?: InputMaybe<Scalars['ID']>;
};

export type CreateColonyStakeInput = {
  colonyId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  totalAmount: Scalars['String'];
  userId: Scalars['ID'];
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

export type CreateExpenditureInput = {
  colonyExpendituresId?: InputMaybe<Scalars['ID']>;
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  ownerAddress: Scalars['ID'];
  slots: Array<ExpenditureSlotInput>;
  status: ExpenditureStatus;
};

export type CreateIngestorStatsInput = {
  id?: InputMaybe<Scalars['ID']>;
  value: Scalars['String'];
};

export type CreateMotionMessageInput = {
  amount?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id?: InputMaybe<Scalars['ID']>;
  initiatorAddress: Scalars['ID'];
  messageKey: Scalars['String'];
  motionId: Scalars['ID'];
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
  chainMetadata: ChainMetadataInput;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  decimals: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  symbol: Scalars['String'];
  thumbnail?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<TokenType>;
};

/** Input data for creating a unique Colony within the Colony Network. Use this instead of the automatically generated `CreateColonyInput` input type */
export type CreateUniqueColonyInput = {
  /** Metadata related to the Colony's creation on the blockchain */
  chainMetadata: ChainMetadataInput;
  /** Unique identifier for the Colony's native token (this is its address) */
  colonyNativeTokenId: Scalars['ID'];
  /** Unique identifier for the Colony. This is the Colony's contract address */
  id: Scalars['ID'];
  /** Display name of the Colony */
  name: Scalars['String'];
  /** Status information for the Colony */
  status?: InputMaybe<ColonyStatusInput>;
  /** Type of the Colony (regular or MetaColony) */
  type?: InputMaybe<ColonyType>;
  /** Version of the currently deployed Colony contract */
  version: Scalars['Int'];
};

/** Input data for creating a unique user within the Colony Network Use this instead of the automatically generated `CreateUserInput` input type */
export type CreateUniqueUserInput = {
  /** Unique identifier for the user. This is the user's wallet address */
  id: Scalars['ID'];
  /** The username */
  name: Scalars['String'];
  /** Profile data for the user */
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

/**
 * The current inverse of the network fee (in wei)
 * (divide 1 by it and get the actual network fee)
 */
export type CurrentNetworkInverseFee = {
  __typename?: 'CurrentNetworkInverseFee';
  createdAt: Scalars['AWSDateTime'];
  /** Unique identifier for the network fee */
  id: Scalars['ID'];
  /** The inverse fee */
  inverseFee: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Represents the current version of an entity in the system */
export type CurrentVersion = {
  __typename?: 'CurrentVersion';
  createdAt: Scalars['AWSDateTime'];
  /** Unique identifier for the CurrentVersion */
  id: Scalars['ID'];
  /** The key used to look up the current version */
  key: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  /** The current version number */
  version: Scalars['Int'];
};

export type DeleteAnnotationInput = {
  id: Scalars['ID'];
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

export type DeleteColonyHistoricRoleInput = {
  id: Scalars['ID'];
};

export type DeleteColonyInput = {
  id: Scalars['ID'];
};

export type DeleteColonyMetadataInput = {
  id: Scalars['ID'];
};

export type DeleteColonyMotionInput = {
  id: Scalars['ID'];
};

export type DeleteColonyRoleInput = {
  id: Scalars['ID'];
};

export type DeleteColonyStakeInput = {
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

export type DeleteExpenditureInput = {
  id: Scalars['ID'];
};

export type DeleteIngestorStatsInput = {
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

/** Represents a Domain within the Colony Network */
export type Domain = {
  __typename?: 'Domain';
  /** Colony associated with the Domain */
  colony: Colony;
  /** Colony ID associated with the Domain */
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  /**
   * Unique identifier for the Domain
   * This should be in the following format: `colonyAddress_nativeId`
   * The native id is the auto-incrementing integer that is assigned to a domain from the contract on creation
   */
  id: Scalars['ID'];
  /** Indicates whether the Domain is the root domain (ID 1) */
  isRoot: Scalars['Boolean'];
  /** Metadata of the Domain */
  metadata?: Maybe<DomainMetadata>;
  /**
   * Native funding pot ID of the Domain
   * The native funding pot ID is assigned to a domain from the contract on creation
   */
  nativeFundingPotId: Scalars['Int'];
  /**
   * Native ID of the Domain
   * The native id is the auto-incrementing integer that is assigned to a domain from the contract on creation
   */
  nativeId: Scalars['Int'];
  /**
   * Native skill ID of the Domain
   * The native skill ID is assigned to a domain from the contract on creation
   */
  nativeSkillId: Scalars['Int'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Variants of available domain colors as used in the dApp */
export enum DomainColor {
  /** An aqua color */
  Aqua = 'AQUA',
  /** A black color */
  Black = 'BLACK',
  /** A blue color */
  Blue = 'BLUE',
  /** A blue-grey(ish) color */
  BlueGrey = 'BLUE_GREY',
  /** An emerald green color */
  EmeraldGreen = 'EMERALD_GREEN',
  /** A gold color */
  Gold = 'GOLD',
  /** A green color */
  Green = 'GREEN',
  /** A light pink color */
  LightPink = 'LIGHT_PINK',
  /** A magenta color */
  Magenta = 'MAGENTA',
  /** An orange color */
  Orange = 'ORANGE',
  /** A pale indigo color */
  Periwinkle = 'PERIWINKLE',
  /** A pink color */
  Pink = 'PINK',
  /** A purple color */
  Purple = 'PURPLE',
  /** A purple-grey(ish) color */
  PurpleGrey = 'PURPLE_GREY',
  /** A red color */
  Red = 'RED',
  /** A yellow color */
  Yellow = 'YELLOW'
}

/** Input type for specifying a Domain */
export type DomainInput = {
  /** Unique identifier for the Domain */
  id: Scalars['ID'];
};

/** Represents metadata for a Domain */
export type DomainMetadata = {
  __typename?: 'DomainMetadata';
  /** List of Domain metadata changelog entries */
  changelog?: Maybe<Array<DomainMetadataChangelog>>;
  /** Color associated with the Domain */
  color: DomainColor;
  createdAt: Scalars['AWSDateTime'];
  /** Description of the Domain */
  description: Scalars['String'];
  /**
   * Unique identifier for the Domain metadata
   * This field is referenced by Domain id, so has to be in the same format: colonyAddress_nativeId
   */
  id: Scalars['ID'];
  /** Name of the Domain */
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
};

/** Represents a changelog entry for Domain metadata */
export type DomainMetadataChangelog = {
  __typename?: 'DomainMetadataChangelog';
  /** Color of the Domain after the change */
  newColor: DomainColor;
  /** Description of the Domain after the change */
  newDescription: Scalars['String'];
  /** Name of the Domain after the change */
  newName: Scalars['String'];
  /** Color of the Domain before the change */
  oldColor: DomainColor;
  /** Description of the Domain before the change */
  oldDescription: Scalars['String'];
  /** Name of the Domain before the change */
  oldName: Scalars['String'];
  /** Transaction hash associated with the changelog entry */
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

/** **Deprecated** Extra permissions for a user, stored during the registration process */
export enum EmailPermissions {
  /** Person is registered and solved the captcha, they can use gasless transactions */
  IsHuman = 'isHuman',
  /** Permission to send notifications to the user */
  SendNotifications = 'sendNotifications'
}

export type Expenditure = {
  __typename?: 'Expenditure';
  colony: Colony;
  colonyExpendituresId?: Maybe<Scalars['ID']>;
  colonyId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  ownerAddress: Scalars['ID'];
  slots: Array<ExpenditureSlot>;
  status: ExpenditureStatus;
  updatedAt: Scalars['AWSDateTime'];
};

export type ExpenditurePayout = {
  __typename?: 'ExpenditurePayout';
  amount: Scalars['String'];
  tokenAddress: Scalars['ID'];
};

export type ExpenditurePayoutInput = {
  amount: Scalars['String'];
  tokenAddress: Scalars['ID'];
};

export type ExpenditureSlot = {
  __typename?: 'ExpenditureSlot';
  claimDelay?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  payoutModifier?: Maybe<Scalars['Int']>;
  payouts?: Maybe<Array<ExpenditurePayout>>;
  recipientAddress?: Maybe<Scalars['String']>;
};

export type ExpenditureSlotInput = {
  claimDelay?: InputMaybe<Scalars['Int']>;
  id: Scalars['Int'];
  payoutModifier?: InputMaybe<Scalars['Int']>;
  payouts?: InputMaybe<Array<ExpenditurePayoutInput>>;
  recipientAddress?: InputMaybe<Scalars['String']>;
};

export enum ExpenditureStatus {
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  Finalized = 'FINALIZED',
  Locked = 'LOCKED'
}

/** Map of parameters that extensions are initialised with */
export type ExtensionParams = {
  __typename?: 'ExtensionParams';
  /** Initialization parameters for the `VotingReputation` extension */
  votingReputation?: Maybe<VotingReputationParams>;
};

export type ExtensionParamsInput = {
  votingReputation?: InputMaybe<VotingReputationParamsInput>;
};

/** Input data for retrieving the state of a motion (i.e. the current period) */
export type GetMotionStateInput = {
  /** The Ethereum address of the Colony */
  colonyAddress: Scalars['String'];
  /** The internal id of the motion in the database */
  databaseMotionId: Scalars['String'];
  /** The hash of the associated transaction */
  transactionHash: Scalars['String'];
};

/** Input data for retrieving the timeout of the current period the motion is in */
export type GetMotionTimeoutPeriodsInput = {
  /** The Ethereum address of the user who voted */
  colonyAddress: Scalars['String'];
  /** The on chain id of the motion */
  motionId: Scalars['String'];
};

/**
 * A return type that contains the timeout periods the motion can be in
 * Represented via a string-integer in milliseconds. Will report 0 for periods that are elapsed and will show the accumulated time for later periods
 */
export type GetMotionTimeoutPeriodsReturn = {
  __typename?: 'GetMotionTimeoutPeriodsReturn';
  /** Time left in escalation period */
  timeLeftToEscalate: Scalars['String'];
  /** Time left in reveal period */
  timeLeftToReveal: Scalars['String'];
  /** Time left in staking period */
  timeLeftToStake: Scalars['String'];
  /** Time left in voting period */
  timeLeftToVote: Scalars['String'];
};

/** Input data for retrieving a user's reputation within the top domains of a Colony */
export type GetReputationForTopDomainsInput = {
  /** The address of the Colony */
  colonyAddress: Scalars['String'];
  /** The root hash of the reputation tree at a specific point in time */
  rootHash?: InputMaybe<Scalars['String']>;
  /** The wallet address of the user */
  walletAddress: Scalars['String'];
};

/** A return type that contains an array of UserDomainReputation items */
export type GetReputationForTopDomainsReturn = {
  __typename?: 'GetReputationForTopDomainsReturn';
  /** An array of UserDomainReputation items */
  items?: Maybe<Array<UserDomainReputation>>;
};

/**
 * Input data for a user's reputation within a Domain in a Colony. If no `domainId` is passed, the Root Domain is used
 * A `rootHash` can be provided, to get reputation at a certain point in the past
 */
export type GetUserReputationInput = {
  /** The Ethereum address of the Colony */
  colonyAddress: Scalars['String'];
  /** The ID of the Domain within the Colony. If not provided, defaults to the Root Domain */
  domainId?: InputMaybe<Scalars['Int']>;
  /** The root hash of the reputation tree at a specific point in time */
  rootHash?: InputMaybe<Scalars['String']>;
  /** The Ethereum wallet address of the user */
  walletAddress: Scalars['String'];
};

/** Input data for retrieving a user's token balance for a specific token */
export type GetUserTokenBalanceInput = {
  /** The Colony address */
  colonyAddress: Scalars['String'];
  /** The address of the token */
  tokenAddress: Scalars['String'];
  /** The wallet address of the user */
  walletAddress: Scalars['String'];
};

/** A return type representing the breakdown of a user's token balance */
export type GetUserTokenBalanceReturn = {
  __typename?: 'GetUserTokenBalanceReturn';
  /**
   * The active portion of the user's token balance
   * This is the balance that is approved for the Colony Network to use (e.g. for governance)
   */
  activeBalance?: Maybe<Scalars['String']>;
  /** The total token balance, including inactive, locked, and active balances */
  balance?: Maybe<Scalars['String']>;
  /**
   * The inactive portion of the user's token balance
   * This is the balance of a token that is in a users wallet but can't be used by the Colony Network (e.g. for governance)
   */
  inactiveBalance?: Maybe<Scalars['String']>;
  /**
   * The locked portion of the user's token balance
   * This is the balance of a token that is staked (e.g. in motions)
   */
  lockedBalance?: Maybe<Scalars['String']>;
  /**
   * The pending portion of the user's token balance
   * These are tokens that have been sent to the wallet, but are inaccessible until all locks are cleared and then these tokens are claimed
   */
  pendingBalance?: Maybe<Scalars['String']>;
};

/** Input data for retrieving the voting rewards for a user within a finished motion */
export type GetVoterRewardsInput = {
  /** The Ethereum address of the Colony */
  colonyAddress: Scalars['String'];
  /** The on chain id of the motion */
  motionId: Scalars['String'];
  /** The on chain id of the domain in which the motion was created */
  nativeMotionDomainId: Scalars['String'];
  /** The root hash of the reputation tree at the time the motion was created */
  rootHash: Scalars['String'];
  /** The Ethereum address of the user who voted */
  voterAddress: Scalars['String'];
};

/** Model storing block ingestor stats, as key-value entries */
export type IngestorStats = {
  __typename?: 'IngestorStats';
  createdAt: Scalars['AWSDateTime'];
  /** Unique identifier of the ingestore stats */
  id: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  /** JSON string to pass custom, dynamic values */
  value: Scalars['String'];
};

/** Input data for fetching the list of members for a specific Colony */
export type MembersForColonyInput = {
  /** Address of the Colony */
  colonyAddress: Scalars['String'];
  /** ID of the domain within the Colony */
  domainId?: InputMaybe<Scalars['Int']>;
  /** Root hash for the reputation state */
  rootHash?: InputMaybe<Scalars['String']>;
  /** Sorting method to apply to the member list */
  sortingMethod?: InputMaybe<SortingMethod>;
};

/**
 * A return type representing the members of a Colony
 *
 * Definitions:
 * * Member = User watching a Colony, with or without reputation
 * * Contributor = User watching a Colony WITH reputation
 * * Watcher = User watching a Colony WITHOUT reputation
 */
export type MembersForColonyReturn = {
  __typename?: 'MembersForColonyReturn';
  /** User watching a Colony WITH reputation */
  contributors?: Maybe<Array<Contributor>>;
  /** User watching a Colony WITHOUT reputation */
  watchers?: Maybe<Array<Watcher>>;
};

export type ModelAnnotationConditionInput = {
  actionId?: InputMaybe<ModelIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelAnnotationConditionInput>>>;
  ipfsHash?: InputMaybe<ModelStringInput>;
  message?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelAnnotationConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelAnnotationConditionInput>>>;
};

export type ModelAnnotationConnection = {
  __typename?: 'ModelAnnotationConnection';
  items: Array<Maybe<Annotation>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelAnnotationFilterInput = {
  actionId?: InputMaybe<ModelIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelAnnotationFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  ipfsHash?: InputMaybe<ModelStringInput>;
  message?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelAnnotationFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelAnnotationFilterInput>>>;
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
  annotationId?: InputMaybe<ModelIdInput>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyActionsId?: InputMaybe<ModelIdInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  fromDomainId?: InputMaybe<ModelIdInput>;
  fundamentalChainId?: InputMaybe<ModelIntInput>;
  individualEvents?: InputMaybe<ModelStringInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  isMotion?: InputMaybe<ModelBooleanInput>;
  motionDomainId?: InputMaybe<ModelIntInput>;
  motionId?: InputMaybe<ModelIdInput>;
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
  annotationId?: InputMaybe<ModelIdInput>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyActionsId?: InputMaybe<ModelIdInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  fromDomainId?: InputMaybe<ModelIdInput>;
  fundamentalChainId?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  individualEvents?: InputMaybe<ModelStringInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  isMotion?: InputMaybe<ModelBooleanInput>;
  motionDomainId?: InputMaybe<ModelIntInput>;
  motionId?: InputMaybe<ModelIdInput>;
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
  expendituresGlobalClaimDelay?: InputMaybe<ModelIntInput>;
  name?: InputMaybe<ModelStringInput>;
  nativeTokenId?: InputMaybe<ModelIdInput>;
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
  expendituresGlobalClaimDelay?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  nativeTokenId?: InputMaybe<ModelIdInput>;
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

export type ModelColonyHistoricRoleConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyHistoricRoleConditionInput>>>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  domainId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyHistoricRoleConditionInput>>>;
  role_0?: InputMaybe<ModelBooleanInput>;
  role_1?: InputMaybe<ModelBooleanInput>;
  role_2?: InputMaybe<ModelBooleanInput>;
  role_3?: InputMaybe<ModelBooleanInput>;
  role_5?: InputMaybe<ModelBooleanInput>;
  role_6?: InputMaybe<ModelBooleanInput>;
  targetAddress?: InputMaybe<ModelIdInput>;
  type?: InputMaybe<ModelStringInput>;
};

export type ModelColonyHistoricRoleConnection = {
  __typename?: 'ModelColonyHistoricRoleConnection';
  items: Array<Maybe<ColonyHistoricRole>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyHistoricRoleFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyHistoricRoleFilterInput>>>;
  blockNumber?: InputMaybe<ModelIntInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  domainId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyHistoricRoleFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyHistoricRoleFilterInput>>>;
  role_0?: InputMaybe<ModelBooleanInput>;
  role_1?: InputMaybe<ModelBooleanInput>;
  role_2?: InputMaybe<ModelBooleanInput>;
  role_3?: InputMaybe<ModelBooleanInput>;
  role_5?: InputMaybe<ModelBooleanInput>;
  role_6?: InputMaybe<ModelBooleanInput>;
  targetAddress?: InputMaybe<ModelIdInput>;
  type?: InputMaybe<ModelStringInput>;
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

export type ModelColonyMotionConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMotionConditionInput>>>;
  createdBy?: InputMaybe<ModelStringInput>;
  hasObjection?: InputMaybe<ModelBooleanInput>;
  isFinalized?: InputMaybe<ModelBooleanInput>;
  motionDomainId?: InputMaybe<ModelIdInput>;
  nativeMotionDomainId?: InputMaybe<ModelStringInput>;
  nativeMotionId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelColonyMotionConditionInput>;
  objectionAnnotationId?: InputMaybe<ModelIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMotionConditionInput>>>;
  remainingStakes?: InputMaybe<ModelStringInput>;
  repSubmitted?: InputMaybe<ModelStringInput>;
  requiredStake?: InputMaybe<ModelStringInput>;
  rootHash?: InputMaybe<ModelStringInput>;
  skillRep?: InputMaybe<ModelStringInput>;
  userMinStake?: InputMaybe<ModelStringInput>;
};

export type ModelColonyMotionConnection = {
  __typename?: 'ModelColonyMotionConnection';
  items: Array<Maybe<ColonyMotion>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyMotionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyMotionFilterInput>>>;
  createdBy?: InputMaybe<ModelStringInput>;
  hasObjection?: InputMaybe<ModelBooleanInput>;
  id?: InputMaybe<ModelIdInput>;
  isFinalized?: InputMaybe<ModelBooleanInput>;
  motionDomainId?: InputMaybe<ModelIdInput>;
  nativeMotionDomainId?: InputMaybe<ModelStringInput>;
  nativeMotionId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelColonyMotionFilterInput>;
  objectionAnnotationId?: InputMaybe<ModelIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyMotionFilterInput>>>;
  remainingStakes?: InputMaybe<ModelStringInput>;
  repSubmitted?: InputMaybe<ModelStringInput>;
  requiredStake?: InputMaybe<ModelStringInput>;
  rootHash?: InputMaybe<ModelStringInput>;
  skillRep?: InputMaybe<ModelStringInput>;
  userMinStake?: InputMaybe<ModelStringInput>;
};

export type ModelColonyRoleConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyRoleConditionInput>>>;
  colonyRolesId?: InputMaybe<ModelIdInput>;
  domainId?: InputMaybe<ModelIdInput>;
  latestBlock?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyRoleConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyRoleConditionInput>>>;
  role_0?: InputMaybe<ModelBooleanInput>;
  role_1?: InputMaybe<ModelBooleanInput>;
  role_2?: InputMaybe<ModelBooleanInput>;
  role_3?: InputMaybe<ModelBooleanInput>;
  role_5?: InputMaybe<ModelBooleanInput>;
  role_6?: InputMaybe<ModelBooleanInput>;
  targetAddress?: InputMaybe<ModelIdInput>;
};

export type ModelColonyRoleConnection = {
  __typename?: 'ModelColonyRoleConnection';
  items: Array<Maybe<ColonyRole>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyRoleFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyRoleFilterInput>>>;
  colonyRolesId?: InputMaybe<ModelIdInput>;
  domainId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  latestBlock?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelColonyRoleFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyRoleFilterInput>>>;
  role_0?: InputMaybe<ModelBooleanInput>;
  role_1?: InputMaybe<ModelBooleanInput>;
  role_2?: InputMaybe<ModelBooleanInput>;
  role_3?: InputMaybe<ModelBooleanInput>;
  role_5?: InputMaybe<ModelBooleanInput>;
  role_6?: InputMaybe<ModelBooleanInput>;
  targetAddress?: InputMaybe<ModelIdInput>;
};

export type ModelColonyStakeConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyStakeConditionInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyStakeConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyStakeConditionInput>>>;
  totalAmount?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
};

export type ModelColonyStakeConnection = {
  __typename?: 'ModelColonyStakeConnection';
  items: Array<Maybe<ColonyStake>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelColonyStakeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelColonyStakeFilterInput>>>;
  colonyId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelColonyStakeFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelColonyStakeFilterInput>>>;
  totalAmount?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
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

export type ModelExpenditureConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelExpenditureConditionInput>>>;
  colonyExpendituresId?: InputMaybe<ModelIdInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelExpenditureConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelExpenditureConditionInput>>>;
  ownerAddress?: InputMaybe<ModelIdInput>;
  status?: InputMaybe<ModelExpenditureStatusInput>;
};

export type ModelExpenditureConnection = {
  __typename?: 'ModelExpenditureConnection';
  items: Array<Maybe<Expenditure>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelExpenditureFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelExpenditureFilterInput>>>;
  colonyExpendituresId?: InputMaybe<ModelIdInput>;
  colonyId?: InputMaybe<ModelIdInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelExpenditureFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelExpenditureFilterInput>>>;
  ownerAddress?: InputMaybe<ModelIdInput>;
  status?: InputMaybe<ModelExpenditureStatusInput>;
};

export type ModelExpenditureStatusInput = {
  eq?: InputMaybe<ExpenditureStatus>;
  ne?: InputMaybe<ExpenditureStatus>;
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

export type ModelIdKeyConditionInput = {
  beginsWith?: InputMaybe<Scalars['ID']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  eq?: InputMaybe<Scalars['ID']>;
  ge?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  le?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
};

export type ModelIngestorStatsConditionInput = {
  and?: InputMaybe<Array<InputMaybe<ModelIngestorStatsConditionInput>>>;
  not?: InputMaybe<ModelIngestorStatsConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelIngestorStatsConditionInput>>>;
  value?: InputMaybe<ModelStringInput>;
};

export type ModelIngestorStatsConnection = {
  __typename?: 'ModelIngestorStatsConnection';
  items: Array<Maybe<IngestorStats>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelIngestorStatsFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelIngestorStatsFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelIngestorStatsFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelIngestorStatsFilterInput>>>;
  value?: InputMaybe<ModelStringInput>;
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
  createdAt?: InputMaybe<ModelStringInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  messageKey?: InputMaybe<ModelStringInput>;
  motionId?: InputMaybe<ModelIdInput>;
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
  createdAt?: InputMaybe<ModelStringInput>;
  initiatorAddress?: InputMaybe<ModelIdInput>;
  messageKey?: InputMaybe<ModelStringInput>;
  motionId?: InputMaybe<ModelIdInput>;
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

export type ModelSubscriptionAnnotationFilterInput = {
  actionId?: InputMaybe<ModelSubscriptionIdInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionAnnotationFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  ipfsHash?: InputMaybe<ModelSubscriptionStringInput>;
  message?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionAnnotationFilterInput>>>;
};

export type ModelSubscriptionBooleanInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
};

export type ModelSubscriptionColonyActionFilterInput = {
  amount?: InputMaybe<ModelSubscriptionStringInput>;
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyActionFilterInput>>>;
  annotationId?: InputMaybe<ModelSubscriptionIdInput>;
  blockNumber?: InputMaybe<ModelSubscriptionIntInput>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  fromDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  fundamentalChainId?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  individualEvents?: InputMaybe<ModelSubscriptionStringInput>;
  initiatorAddress?: InputMaybe<ModelSubscriptionIdInput>;
  isMotion?: InputMaybe<ModelSubscriptionBooleanInput>;
  motionDomainId?: InputMaybe<ModelSubscriptionIntInput>;
  motionId?: InputMaybe<ModelSubscriptionIdInput>;
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
  expendituresGlobalClaimDelay?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  nativeTokenId?: InputMaybe<ModelSubscriptionIdInput>;
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

export type ModelSubscriptionColonyHistoricRoleFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyHistoricRoleFilterInput>>>;
  blockNumber?: InputMaybe<ModelSubscriptionIntInput>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  domainId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyHistoricRoleFilterInput>>>;
  role_0?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_1?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_2?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_3?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_5?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_6?: InputMaybe<ModelSubscriptionBooleanInput>;
  targetAddress?: InputMaybe<ModelSubscriptionIdInput>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
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

export type ModelSubscriptionColonyMotionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyMotionFilterInput>>>;
  createdBy?: InputMaybe<ModelSubscriptionStringInput>;
  hasObjection?: InputMaybe<ModelSubscriptionBooleanInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  isFinalized?: InputMaybe<ModelSubscriptionBooleanInput>;
  motionDomainId?: InputMaybe<ModelSubscriptionIdInput>;
  nativeMotionDomainId?: InputMaybe<ModelSubscriptionStringInput>;
  nativeMotionId?: InputMaybe<ModelSubscriptionStringInput>;
  objectionAnnotationId?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyMotionFilterInput>>>;
  remainingStakes?: InputMaybe<ModelSubscriptionStringInput>;
  repSubmitted?: InputMaybe<ModelSubscriptionStringInput>;
  requiredStake?: InputMaybe<ModelSubscriptionStringInput>;
  rootHash?: InputMaybe<ModelSubscriptionStringInput>;
  skillRep?: InputMaybe<ModelSubscriptionStringInput>;
  userMinStake?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionColonyRoleFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyRoleFilterInput>>>;
  domainId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  latestBlock?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyRoleFilterInput>>>;
  role_0?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_1?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_2?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_3?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_5?: InputMaybe<ModelSubscriptionBooleanInput>;
  role_6?: InputMaybe<ModelSubscriptionBooleanInput>;
  targetAddress?: InputMaybe<ModelSubscriptionIdInput>;
};

export type ModelSubscriptionColonyStakeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyStakeFilterInput>>>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionColonyStakeFilterInput>>>;
  totalAmount?: InputMaybe<ModelSubscriptionStringInput>;
  userId?: InputMaybe<ModelSubscriptionIdInput>;
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

export type ModelSubscriptionExpenditureFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionExpenditureFilterInput>>>;
  colonyId?: InputMaybe<ModelSubscriptionIdInput>;
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionExpenditureFilterInput>>>;
  ownerAddress?: InputMaybe<ModelSubscriptionIdInput>;
  status?: InputMaybe<ModelSubscriptionStringInput>;
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

export type ModelSubscriptionIngestorStatsFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionIngestorStatsFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionIngestorStatsFilterInput>>>;
  value?: InputMaybe<ModelSubscriptionStringInput>;
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
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  initiatorAddress?: InputMaybe<ModelSubscriptionIdInput>;
  messageKey?: InputMaybe<ModelSubscriptionStringInput>;
  motionId?: InputMaybe<ModelSubscriptionIdInput>;
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

/** A status update message for a motion (will appear in the motion's timeline) */
export type MotionMessage = {
  __typename?: 'MotionMessage';
  /** Token amount relevant to the status update (if applicable) */
  amount?: Maybe<Scalars['String']>;
  /** Timestamp of when the status update was created in the database */
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  /**
   * Wallet address of the initiator of the status update
   * The zero address is used for messages that don't have an initiator (system messages)
   */
  initiatorAddress: Scalars['ID'];
  /** Extended user object for given initiatorAddress */
  initiatorUser?: Maybe<User>;
  /** Unique id for the message */
  messageKey: Scalars['String'];
  /** The internal database id of the motion */
  motionId: Scalars['ID'];
  /** Internal name of the status update event (e.g. `MotionCreated`, `MotionStaked`, etc.) */
  name: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  /** Cast vote attached to the status update (if applicable) */
  vote?: Maybe<Scalars['String']>;
};

/** Input used to create a motion status update message */
export type MotionMessageInput = {
  /** Token amount relevant to the status update (if applicable) */
  amount?: InputMaybe<Scalars['String']>;
  /**
   * Wallet address of the initiator of the status update
   * The zero address is used for messages that don't have an initiator (system messages)
   */
  initiatorAddress: Scalars['String'];
  /** Unique id for the message */
  messageKey: Scalars['String'];
  /** Internal name of the status update event (e.g. `MotionCreated`, `MotionStaked`, etc.) */
  name: Scalars['String'];
  /** Cast vote attached to the status update (if applicable) */
  vote?: InputMaybe<Scalars['String']>;
};

/** Staked sides of a motion */
export type MotionStakeValues = {
  __typename?: 'MotionStakeValues';
  /** Number of votes against this motion */
  nay: Scalars['String'];
  /** Number of votes for this motion */
  yay: Scalars['String'];
};

/** Input type for modifying the staked side of a motion */
export type MotionStakeValuesInput = {
  /** Number of votes against this motion */
  nay: Scalars['String'];
  /** Number of votes for this motion */
  yay: Scalars['String'];
};

/** Staked sides of a motion */
export type MotionStakes = {
  __typename?: 'MotionStakes';
  /** Values in percentage of the total stakes */
  percentage: MotionStakeValues;
  /** Absolute values denominated in the native token */
  raw: MotionStakeValues;
};

/** Input used to modify the staked sides of a motion */
export type MotionStakesInput = {
  /** Values in percentage of the total stakes */
  percentage: MotionStakeValuesInput;
  /** Absolute values denominated in the native token */
  raw: MotionStakeValuesInput;
};

/** Quick access flages to check the current state of a motion in its lifecycle */
export type MotionStateHistory = {
  __typename?: 'MotionStateHistory';
  /** Whether the motion has failed */
  hasFailed: Scalars['Boolean'];
  /** Whether the motion has failed and cannot be finalized (e.g. if it doesn't get staked) */
  hasFailedNotFinalizable: Scalars['Boolean'];
  /** Whether the motion has passed */
  hasPassed: Scalars['Boolean'];
  /** Voting period is elapsed */
  hasVoted: Scalars['Boolean'];
  /** Motion is in reveal phase (votes are being revealed) */
  inRevealPhase: Scalars['Boolean'];
};

/** Input used to change the current state of a motion */
export type MotionStateHistoryInput = {
  /** Whether the motion has failed */
  hasFailed: Scalars['Boolean'];
  /** Whether the motion has failed and cannot be finalized (e.g. if it doesn't get staked) */
  hasFailedNotFinalizable: Scalars['Boolean'];
  /** Whether the motion has passed */
  hasPassed: Scalars['Boolean'];
  /** Voting period is elapsed */
  hasVoted: Scalars['Boolean'];
  /** Motion is in reveal phase (votes are being revealed) */
  inRevealPhase: Scalars['Boolean'];
};

/** Root mutation type */
export type Mutation = {
  __typename?: 'Mutation';
  createAnnotation?: Maybe<Annotation>;
  createColony?: Maybe<Colony>;
  createColonyAction?: Maybe<ColonyAction>;
  createColonyExtension?: Maybe<ColonyExtension>;
  createColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  createColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  createColonyMetadata?: Maybe<ColonyMetadata>;
  createColonyMotion?: Maybe<ColonyMotion>;
  createColonyRole?: Maybe<ColonyRole>;
  createColonyStake?: Maybe<ColonyStake>;
  createColonyTokens?: Maybe<ColonyTokens>;
  createContractEvent?: Maybe<ContractEvent>;
  createCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  createCurrentVersion?: Maybe<CurrentVersion>;
  createDomain?: Maybe<Domain>;
  createDomainMetadata?: Maybe<DomainMetadata>;
  createExpenditure?: Maybe<Expenditure>;
  createIngestorStats?: Maybe<IngestorStats>;
  createMotionMessage?: Maybe<MotionMessage>;
  createProfile?: Maybe<Profile>;
  createToken?: Maybe<Token>;
  /** Create a unique Colony within the Colony Network. Use this instead of the automatically generated `createColony` mutation */
  createUniqueColony?: Maybe<Colony>;
  /** Create a unique user within the Colony Network. Use this instead of the automatically generated `createUser` mutation */
  createUniqueUser?: Maybe<User>;
  createUser?: Maybe<User>;
  createUserTokens?: Maybe<UserTokens>;
  createWatchedColonies?: Maybe<WatchedColonies>;
  deleteAnnotation?: Maybe<Annotation>;
  deleteColony?: Maybe<Colony>;
  deleteColonyAction?: Maybe<ColonyAction>;
  deleteColonyExtension?: Maybe<ColonyExtension>;
  deleteColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  deleteColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  deleteColonyMetadata?: Maybe<ColonyMetadata>;
  deleteColonyMotion?: Maybe<ColonyMotion>;
  deleteColonyRole?: Maybe<ColonyRole>;
  deleteColonyStake?: Maybe<ColonyStake>;
  deleteColonyTokens?: Maybe<ColonyTokens>;
  deleteContractEvent?: Maybe<ContractEvent>;
  deleteCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  deleteCurrentVersion?: Maybe<CurrentVersion>;
  deleteDomain?: Maybe<Domain>;
  deleteDomainMetadata?: Maybe<DomainMetadata>;
  deleteExpenditure?: Maybe<Expenditure>;
  deleteIngestorStats?: Maybe<IngestorStats>;
  deleteMotionMessage?: Maybe<MotionMessage>;
  deleteProfile?: Maybe<Profile>;
  deleteToken?: Maybe<Token>;
  deleteUser?: Maybe<User>;
  deleteUserTokens?: Maybe<UserTokens>;
  deleteWatchedColonies?: Maybe<WatchedColonies>;
  /** Updates the latest available version of a Colony or an extension */
  setCurrentVersion?: Maybe<Scalars['Boolean']>;
  updateAnnotation?: Maybe<Annotation>;
  updateColony?: Maybe<Colony>;
  updateColonyAction?: Maybe<ColonyAction>;
  updateColonyExtension?: Maybe<ColonyExtension>;
  updateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  updateColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  updateColonyMetadata?: Maybe<ColonyMetadata>;
  updateColonyMotion?: Maybe<ColonyMotion>;
  updateColonyRole?: Maybe<ColonyRole>;
  updateColonyStake?: Maybe<ColonyStake>;
  updateColonyTokens?: Maybe<ColonyTokens>;
  updateContractEvent?: Maybe<ContractEvent>;
  updateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  updateCurrentVersion?: Maybe<CurrentVersion>;
  updateDomain?: Maybe<Domain>;
  updateDomainMetadata?: Maybe<DomainMetadata>;
  updateExpenditure?: Maybe<Expenditure>;
  /**
   * Update an extension's details for a specific Colony
   * The extension hash is generated like so: `keccak256(toUtf8Bytes(extensionName))`, where `extensionName` is the name of the extension contract file in the Colony Network (e.g. `VotingReputation`)
   */
  updateExtensionByColonyAndHash?: Maybe<ColonyExtension>;
  updateIngestorStats?: Maybe<IngestorStats>;
  updateMotionMessage?: Maybe<MotionMessage>;
  updateProfile?: Maybe<Profile>;
  updateToken?: Maybe<Token>;
  updateUser?: Maybe<User>;
  updateUserTokens?: Maybe<UserTokens>;
  updateWatchedColonies?: Maybe<WatchedColonies>;
};


/** Root mutation type */
export type MutationCreateAnnotationArgs = {
  condition?: InputMaybe<ModelAnnotationConditionInput>;
  input: CreateAnnotationInput;
};


/** Root mutation type */
export type MutationCreateColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: CreateColonyInput;
};


/** Root mutation type */
export type MutationCreateColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: CreateColonyActionInput;
};


/** Root mutation type */
export type MutationCreateColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: CreateColonyExtensionInput;
};


/** Root mutation type */
export type MutationCreateColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: CreateColonyFundsClaimInput;
};


/** Root mutation type */
export type MutationCreateColonyHistoricRoleArgs = {
  condition?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  input: CreateColonyHistoricRoleInput;
};


/** Root mutation type */
export type MutationCreateColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: CreateColonyMetadataInput;
};


/** Root mutation type */
export type MutationCreateColonyMotionArgs = {
  condition?: InputMaybe<ModelColonyMotionConditionInput>;
  input: CreateColonyMotionInput;
};


/** Root mutation type */
export type MutationCreateColonyRoleArgs = {
  condition?: InputMaybe<ModelColonyRoleConditionInput>;
  input: CreateColonyRoleInput;
};


/** Root mutation type */
export type MutationCreateColonyStakeArgs = {
  condition?: InputMaybe<ModelColonyStakeConditionInput>;
  input: CreateColonyStakeInput;
};


/** Root mutation type */
export type MutationCreateColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: CreateColonyTokensInput;
};


/** Root mutation type */
export type MutationCreateContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: CreateContractEventInput;
};


/** Root mutation type */
export type MutationCreateCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: CreateCurrentNetworkInverseFeeInput;
};


/** Root mutation type */
export type MutationCreateCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: CreateCurrentVersionInput;
};


/** Root mutation type */
export type MutationCreateDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: CreateDomainInput;
};


/** Root mutation type */
export type MutationCreateDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: CreateDomainMetadataInput;
};


/** Root mutation type */
export type MutationCreateExpenditureArgs = {
  condition?: InputMaybe<ModelExpenditureConditionInput>;
  input: CreateExpenditureInput;
};


/** Root mutation type */
export type MutationCreateIngestorStatsArgs = {
  condition?: InputMaybe<ModelIngestorStatsConditionInput>;
  input: CreateIngestorStatsInput;
};


/** Root mutation type */
export type MutationCreateMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: CreateMotionMessageInput;
};


/** Root mutation type */
export type MutationCreateProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: CreateProfileInput;
};


/** Root mutation type */
export type MutationCreateTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: CreateTokenInput;
};


/** Root mutation type */
export type MutationCreateUniqueColonyArgs = {
  input?: InputMaybe<CreateUniqueColonyInput>;
};


/** Root mutation type */
export type MutationCreateUniqueUserArgs = {
  input?: InputMaybe<CreateUniqueUserInput>;
};


/** Root mutation type */
export type MutationCreateUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: CreateUserInput;
};


/** Root mutation type */
export type MutationCreateUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: CreateUserTokensInput;
};


/** Root mutation type */
export type MutationCreateWatchedColoniesArgs = {
  condition?: InputMaybe<ModelWatchedColoniesConditionInput>;
  input: CreateWatchedColoniesInput;
};


/** Root mutation type */
export type MutationDeleteAnnotationArgs = {
  condition?: InputMaybe<ModelAnnotationConditionInput>;
  input: DeleteAnnotationInput;
};


/** Root mutation type */
export type MutationDeleteColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: DeleteColonyInput;
};


/** Root mutation type */
export type MutationDeleteColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: DeleteColonyActionInput;
};


/** Root mutation type */
export type MutationDeleteColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: DeleteColonyExtensionInput;
};


/** Root mutation type */
export type MutationDeleteColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: DeleteColonyFundsClaimInput;
};


/** Root mutation type */
export type MutationDeleteColonyHistoricRoleArgs = {
  condition?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  input: DeleteColonyHistoricRoleInput;
};


/** Root mutation type */
export type MutationDeleteColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: DeleteColonyMetadataInput;
};


/** Root mutation type */
export type MutationDeleteColonyMotionArgs = {
  condition?: InputMaybe<ModelColonyMotionConditionInput>;
  input: DeleteColonyMotionInput;
};


/** Root mutation type */
export type MutationDeleteColonyRoleArgs = {
  condition?: InputMaybe<ModelColonyRoleConditionInput>;
  input: DeleteColonyRoleInput;
};


/** Root mutation type */
export type MutationDeleteColonyStakeArgs = {
  condition?: InputMaybe<ModelColonyStakeConditionInput>;
  input: DeleteColonyStakeInput;
};


/** Root mutation type */
export type MutationDeleteColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: DeleteColonyTokensInput;
};


/** Root mutation type */
export type MutationDeleteContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: DeleteContractEventInput;
};


/** Root mutation type */
export type MutationDeleteCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: DeleteCurrentNetworkInverseFeeInput;
};


/** Root mutation type */
export type MutationDeleteCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: DeleteCurrentVersionInput;
};


/** Root mutation type */
export type MutationDeleteDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: DeleteDomainInput;
};


/** Root mutation type */
export type MutationDeleteDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: DeleteDomainMetadataInput;
};


/** Root mutation type */
export type MutationDeleteExpenditureArgs = {
  condition?: InputMaybe<ModelExpenditureConditionInput>;
  input: DeleteExpenditureInput;
};


/** Root mutation type */
export type MutationDeleteIngestorStatsArgs = {
  condition?: InputMaybe<ModelIngestorStatsConditionInput>;
  input: DeleteIngestorStatsInput;
};


/** Root mutation type */
export type MutationDeleteMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: DeleteMotionMessageInput;
};


/** Root mutation type */
export type MutationDeleteProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: DeleteProfileInput;
};


/** Root mutation type */
export type MutationDeleteTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: DeleteTokenInput;
};


/** Root mutation type */
export type MutationDeleteUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: DeleteUserInput;
};


/** Root mutation type */
export type MutationDeleteUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: DeleteUserTokensInput;
};


/** Root mutation type */
export type MutationDeleteWatchedColoniesArgs = {
  condition?: InputMaybe<ModelWatchedColoniesConditionInput>;
  input: DeleteWatchedColoniesInput;
};


/** Root mutation type */
export type MutationSetCurrentVersionArgs = {
  input?: InputMaybe<SetCurrentVersionInput>;
};


/** Root mutation type */
export type MutationUpdateAnnotationArgs = {
  condition?: InputMaybe<ModelAnnotationConditionInput>;
  input: UpdateAnnotationInput;
};


/** Root mutation type */
export type MutationUpdateColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: UpdateColonyInput;
};


/** Root mutation type */
export type MutationUpdateColonyActionArgs = {
  condition?: InputMaybe<ModelColonyActionConditionInput>;
  input: UpdateColonyActionInput;
};


/** Root mutation type */
export type MutationUpdateColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: UpdateColonyExtensionInput;
};


/** Root mutation type */
export type MutationUpdateColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: UpdateColonyFundsClaimInput;
};


/** Root mutation type */
export type MutationUpdateColonyHistoricRoleArgs = {
  condition?: InputMaybe<ModelColonyHistoricRoleConditionInput>;
  input: UpdateColonyHistoricRoleInput;
};


/** Root mutation type */
export type MutationUpdateColonyMetadataArgs = {
  condition?: InputMaybe<ModelColonyMetadataConditionInput>;
  input: UpdateColonyMetadataInput;
};


/** Root mutation type */
export type MutationUpdateColonyMotionArgs = {
  condition?: InputMaybe<ModelColonyMotionConditionInput>;
  input: UpdateColonyMotionInput;
};


/** Root mutation type */
export type MutationUpdateColonyRoleArgs = {
  condition?: InputMaybe<ModelColonyRoleConditionInput>;
  input: UpdateColonyRoleInput;
};


/** Root mutation type */
export type MutationUpdateColonyStakeArgs = {
  condition?: InputMaybe<ModelColonyStakeConditionInput>;
  input: UpdateColonyStakeInput;
};


/** Root mutation type */
export type MutationUpdateColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: UpdateColonyTokensInput;
};


/** Root mutation type */
export type MutationUpdateContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: UpdateContractEventInput;
};


/** Root mutation type */
export type MutationUpdateCurrentNetworkInverseFeeArgs = {
  condition?: InputMaybe<ModelCurrentNetworkInverseFeeConditionInput>;
  input: UpdateCurrentNetworkInverseFeeInput;
};


/** Root mutation type */
export type MutationUpdateCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: UpdateCurrentVersionInput;
};


/** Root mutation type */
export type MutationUpdateDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: UpdateDomainInput;
};


/** Root mutation type */
export type MutationUpdateDomainMetadataArgs = {
  condition?: InputMaybe<ModelDomainMetadataConditionInput>;
  input: UpdateDomainMetadataInput;
};


/** Root mutation type */
export type MutationUpdateExpenditureArgs = {
  condition?: InputMaybe<ModelExpenditureConditionInput>;
  input: UpdateExpenditureInput;
};


/** Root mutation type */
export type MutationUpdateExtensionByColonyAndHashArgs = {
  input?: InputMaybe<UpdateExtensionByColonyAndHashInput>;
};


/** Root mutation type */
export type MutationUpdateIngestorStatsArgs = {
  condition?: InputMaybe<ModelIngestorStatsConditionInput>;
  input: UpdateIngestorStatsInput;
};


/** Root mutation type */
export type MutationUpdateMotionMessageArgs = {
  condition?: InputMaybe<ModelMotionMessageConditionInput>;
  input: UpdateMotionMessageInput;
};


/** Root mutation type */
export type MutationUpdateProfileArgs = {
  condition?: InputMaybe<ModelProfileConditionInput>;
  input: UpdateProfileInput;
};


/** Root mutation type */
export type MutationUpdateTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: UpdateTokenInput;
};


/** Root mutation type */
export type MutationUpdateUserArgs = {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: UpdateUserInput;
};


/** Root mutation type */
export type MutationUpdateUserTokensArgs = {
  condition?: InputMaybe<ModelUserTokensConditionInput>;
  input: UpdateUserTokensInput;
};


/** Root mutation type */
export type MutationUpdateWatchedColoniesArgs = {
  condition?: InputMaybe<ModelWatchedColoniesConditionInput>;
  input: UpdateWatchedColoniesInput;
};

/**
 * Represents the status of a Colony's native token
 * Colonies can have different types of native tokens in various modes. Here we define some important properties that the dApp uses to enable or disable certain features or views. This is set when a Colony is created and can be changed later
 */
export type NativeTokenStatus = {
  __typename?: 'NativeTokenStatus';
  /** Whether the user has permissions to mint new tokens */
  mintable?: Maybe<Scalars['Boolean']>;
  /** Whether the native token can be unlocked */
  unlockable?: Maybe<Scalars['Boolean']>;
  /** Whether the native token is unlocked */
  unlocked?: Maybe<Scalars['Boolean']>;
};

/**
 * Input data for the status of a Colony's native token
 *
 * Colonies can have different types of native tokens in various modes. Here we define some important properties that the dApp uses to enable or disable certain features or views. This is set when a Colony is created and can be changed later
 */
export type NativeTokenStatusInput = {
  /** Whether the native token is mintable */
  mintable?: InputMaybe<Scalars['Boolean']>;
  /** Whether the native token can be unlocked */
  unlockable?: InputMaybe<Scalars['Boolean']>;
  /** Whether the native token is unlocked */
  unlocked?: InputMaybe<Scalars['Boolean']>;
};

/** Variants of supported Ethereum networks */
export enum Network {
  /** Local development network using Ganache */
  Ganache = 'GANACHE',
  /** Gnosis Chain network */
  Gnosis = 'GNOSIS',
  /** Fork of Gnosis Chain for QA purposes */
  Gnosisfork = 'GNOSISFORK',
  /** Ethereum Goerli test network */
  Goerli = 'GOERLI',
  /** Ethereum Mainnet */
  Mainnet = 'MAINNET'
}

/** Colony token modifications that are stored temporarily and commited to the database once the corresponding motion passes */
export type PendingModifiedTokenAddresses = {
  __typename?: 'PendingModifiedTokenAddresses';
  /** List of tokens that were added to the Colony's token list */
  added?: Maybe<Array<Scalars['String']>>;
  /** List of tokens that were removed from the Colony's token list */
  removed?: Maybe<Array<Scalars['String']>>;
};

export type PendingModifiedTokenAddressesInput = {
  added?: InputMaybe<Array<Scalars['String']>>;
  removed?: InputMaybe<Array<Scalars['String']>>;
};

/** Represents a user's profile within the Colony Network */
export type Profile = {
  __typename?: 'Profile';
  /** URL of the user's avatar image */
  avatar?: Maybe<Scalars['String']>;
  /** User's bio information */
  bio?: Maybe<Scalars['String']>;
  createdAt: Scalars['AWSDateTime'];
  /** Display name of the user */
  displayName?: Maybe<Scalars['String']>;
  /** User's email address */
  email?: Maybe<Scalars['AWSEmail']>;
  /** Unique identifier for the user's profile */
  id: Scalars['ID'];
  /** User's location information */
  location?: Maybe<Scalars['String']>;
  /** Metadata associated with the user's profile */
  meta?: Maybe<ProfileMetadata>;
  /** URL of the user's thumbnail image */
  thumbnail?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
  /** URL of the user's website */
  website?: Maybe<Scalars['AWSURL']>;
};

/** Input data to use when creating or changing a user profile */
export type ProfileInput = {
  /** The URL of the user's avatar image */
  avatar?: InputMaybe<Scalars['String']>;
  /** A short description or biography of the user. */
  bio?: InputMaybe<Scalars['String']>;
  /** The display name of the user */
  displayName?: InputMaybe<Scalars['String']>;
  /** The user's email address */
  email?: InputMaybe<Scalars['AWSEmail']>;
  /** The unique identifier for the user profile */
  id?: InputMaybe<Scalars['ID']>;
  /** The user's location (e.g., city or country) */
  location?: InputMaybe<Scalars['String']>;
  /** Any additional metadata or settings related to the user profile */
  meta?: InputMaybe<ProfileMetadataInput>;
  /** The URL of the user's thumbnail image */
  thumbnail?: InputMaybe<Scalars['String']>;
  /** The user's personal or professional website */
  website?: InputMaybe<Scalars['AWSURL']>;
};

/** Represents metadata for a user's profile. Mostly user specific settings */
export type ProfileMetadata = {
  __typename?: 'ProfileMetadata';
  /** The URL of the user's custom RPC node */
  customRpc?: Maybe<Scalars['String']>;
  /** A flag to indicate whether the user has enabled the decentralized mode */
  decentralizedModeEnabled?: Maybe<Scalars['Boolean']>;
  /** List of email permissions for the user */
  emailPermissions: Array<Scalars['String']>;
  /** A flag to indicate whether the user has enabled metatransactions */
  metatransactionsEnabled?: Maybe<Scalars['Boolean']>;
};

/** Input data for a user's profile metadata */
export type ProfileMetadataInput = {
  /** The URL of the user's custom RPC node */
  customRpc?: InputMaybe<Scalars['String']>;
  /** A flag to indicate whether the user has enabled the decentralized mode */
  decentralizedModeEnabled?: InputMaybe<Scalars['Boolean']>;
  /** List of email permissions for the user */
  emailPermissions: Array<Scalars['String']>;
  /** A flag to indicate whether the user has enabled metatransactions */
  metatransactionsEnabled?: InputMaybe<Scalars['Boolean']>;
};

/** Root query type */
export type Query = {
  __typename?: 'Query';
  getActionsByColony?: Maybe<ModelColonyActionConnection>;
  getAnnotation?: Maybe<Annotation>;
  getColoniesByNativeTokenId?: Maybe<ModelColonyConnection>;
  getColony?: Maybe<Colony>;
  getColonyAction?: Maybe<ColonyAction>;
  getColonyActionByMotionId?: Maybe<ModelColonyActionConnection>;
  getColonyByAddress?: Maybe<ModelColonyConnection>;
  getColonyByName?: Maybe<ModelColonyConnection>;
  getColonyByType?: Maybe<ModelColonyConnection>;
  getColonyExtension?: Maybe<ColonyExtension>;
  getColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  getColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  getColonyHistoricRoleByDate?: Maybe<ModelColonyHistoricRoleConnection>;
  getColonyMetadata?: Maybe<ColonyMetadata>;
  getColonyMotion?: Maybe<ColonyMotion>;
  getColonyRole?: Maybe<ColonyRole>;
  getColonyStake?: Maybe<ColonyStake>;
  getColonyStakeByUserAddress?: Maybe<ModelColonyStakeConnection>;
  getColonyTokens?: Maybe<ColonyTokens>;
  getContractEvent?: Maybe<ContractEvent>;
  getCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  getCurrentVersion?: Maybe<CurrentVersion>;
  getCurrentVersionByKey?: Maybe<ModelCurrentVersionConnection>;
  getDomain?: Maybe<Domain>;
  getDomainMetadata?: Maybe<DomainMetadata>;
  getExpenditure?: Maybe<Expenditure>;
  getExpendituresByColony?: Maybe<ModelExpenditureConnection>;
  getExtensionByColonyAndHash?: Maybe<ModelColonyExtensionConnection>;
  getExtensionsByHash?: Maybe<ModelColonyExtensionConnection>;
  getIngestorStats?: Maybe<IngestorStats>;
  /** Fetch the list of members for a specific Colony */
  getMembersForColony?: Maybe<MembersForColonyReturn>;
  getMotionMessage?: Maybe<MotionMessage>;
  getMotionMessageByMotionId?: Maybe<ModelMotionMessageConnection>;
  /** Get the state of a motion (i.e. the current period) */
  getMotionState: Scalars['Int'];
  /** Get the timeout for the current period of a motion */
  getMotionTimeoutPeriods?: Maybe<GetMotionTimeoutPeriodsReturn>;
  getProfile?: Maybe<Profile>;
  getProfileByEmail?: Maybe<ModelProfileConnection>;
  /** Retrieve a user's reputation within the top domains of a Colony */
  getReputationForTopDomains?: Maybe<GetReputationForTopDomainsReturn>;
  getToken?: Maybe<Token>;
  getTokenByAddress?: Maybe<ModelTokenConnection>;
  /** Fetch a token's information. Tries to get the data from the DB first, if that fails, resolves to get data from chain */
  getTokenFromEverywhere?: Maybe<TokenFromEverywhereReturn>;
  getTokensByType?: Maybe<ModelTokenConnection>;
  getUser?: Maybe<User>;
  getUserByAddress?: Maybe<ModelUserConnection>;
  getUserByName?: Maybe<ModelUserConnection>;
  /** Retrieve a user's reputation within a specific domain in a Colony */
  getUserReputation?: Maybe<Scalars['String']>;
  /** Retrieve a user's token balance for a specific token */
  getUserTokenBalance?: Maybe<GetUserTokenBalanceReturn>;
  getUserTokens?: Maybe<UserTokens>;
  /** Get the voting reward for a user and a motion */
  getVoterRewards?: Maybe<VoterRewardsReturn>;
  getWatchedColonies?: Maybe<WatchedColonies>;
  listAnnotations?: Maybe<ModelAnnotationConnection>;
  listColonies?: Maybe<ModelColonyConnection>;
  listColonyActions?: Maybe<ModelColonyActionConnection>;
  listColonyExtensions?: Maybe<ModelColonyExtensionConnection>;
  listColonyFundsClaims?: Maybe<ModelColonyFundsClaimConnection>;
  listColonyHistoricRoles?: Maybe<ModelColonyHistoricRoleConnection>;
  listColonyMetadata?: Maybe<ModelColonyMetadataConnection>;
  listColonyMotions?: Maybe<ModelColonyMotionConnection>;
  listColonyRoles?: Maybe<ModelColonyRoleConnection>;
  listColonyStakes?: Maybe<ModelColonyStakeConnection>;
  listColonyTokens?: Maybe<ModelColonyTokensConnection>;
  listContractEvents?: Maybe<ModelContractEventConnection>;
  listCurrentNetworkInverseFees?: Maybe<ModelCurrentNetworkInverseFeeConnection>;
  listCurrentVersions?: Maybe<ModelCurrentVersionConnection>;
  listDomainMetadata?: Maybe<ModelDomainMetadataConnection>;
  listDomains?: Maybe<ModelDomainConnection>;
  listExpenditures?: Maybe<ModelExpenditureConnection>;
  listIngestorStats?: Maybe<ModelIngestorStatsConnection>;
  listMotionMessages?: Maybe<ModelMotionMessageConnection>;
  listProfiles?: Maybe<ModelProfileConnection>;
  listTokens?: Maybe<ModelTokenConnection>;
  listUserTokens?: Maybe<ModelUserTokensConnection>;
  listUsers?: Maybe<ModelUserConnection>;
  listWatchedColonies?: Maybe<ModelWatchedColoniesConnection>;
};


/** Root query type */
export type QueryGetActionsByColonyArgs = {
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetAnnotationArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetColoniesByNativeTokenIdArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nativeTokenId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetColonyArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetColonyActionArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetColonyActionByMotionIdArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  motionId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetColonyByAddressArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetColonyByNameArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetColonyByTypeArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: ColonyType;
};


/** Root query type */
export type QueryGetColonyExtensionArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetColonyFundsClaimArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetColonyHistoricRoleArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetColonyHistoricRoleByDateArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelColonyHistoricRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: Scalars['String'];
};


/** Root query type */
export type QueryGetColonyMetadataArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetColonyMotionArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetColonyRoleArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetColonyStakeArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetColonyStakeByUserAddressArgs = {
  colonyId?: InputMaybe<ModelIdKeyConditionInput>;
  filter?: InputMaybe<ModelColonyStakeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  userId: Scalars['ID'];
};


/** Root query type */
export type QueryGetColonyTokensArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetContractEventArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetCurrentNetworkInverseFeeArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetCurrentVersionArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetCurrentVersionByKeyArgs = {
  filter?: InputMaybe<ModelCurrentVersionFilterInput>;
  key: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetDomainArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetDomainMetadataArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetExpenditureArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetExpendituresByColonyArgs = {
  colonyId: Scalars['ID'];
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelExpenditureFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetExtensionByColonyAndHashArgs = {
  colonyId: Scalars['ID'];
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetExtensionsByHashArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetIngestorStatsArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetMembersForColonyArgs = {
  input?: InputMaybe<MembersForColonyInput>;
};


/** Root query type */
export type QueryGetMotionMessageArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetMotionMessageByMotionIdArgs = {
  createdAt?: InputMaybe<ModelStringKeyConditionInput>;
  filter?: InputMaybe<ModelMotionMessageFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  motionId: Scalars['ID'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetMotionStateArgs = {
  input?: InputMaybe<GetMotionStateInput>;
};


/** Root query type */
export type QueryGetMotionTimeoutPeriodsArgs = {
  input?: InputMaybe<GetMotionTimeoutPeriodsInput>;
};


/** Root query type */
export type QueryGetProfileArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetProfileByEmailArgs = {
  email: Scalars['AWSEmail'];
  filter?: InputMaybe<ModelProfileFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetReputationForTopDomainsArgs = {
  input?: InputMaybe<GetReputationForTopDomainsInput>;
};


/** Root query type */
export type QueryGetTokenArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetTokenByAddressArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetTokenFromEverywhereArgs = {
  input?: InputMaybe<TokenFromEverywhereArguments>;
};


/** Root query type */
export type QueryGetTokensByTypeArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
  type: TokenType;
};


/** Root query type */
export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetUserByAddressArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  id: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetUserByNameArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Root query type */
export type QueryGetUserReputationArgs = {
  input?: InputMaybe<GetUserReputationInput>;
};


/** Root query type */
export type QueryGetUserTokenBalanceArgs = {
  input?: InputMaybe<GetUserTokenBalanceInput>;
};


/** Root query type */
export type QueryGetUserTokensArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryGetVoterRewardsArgs = {
  input?: InputMaybe<GetVoterRewardsInput>;
};


/** Root query type */
export type QueryGetWatchedColoniesArgs = {
  id: Scalars['ID'];
};


/** Root query type */
export type QueryListAnnotationsArgs = {
  filter?: InputMaybe<ModelAnnotationFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListColoniesArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListColonyActionsArgs = {
  filter?: InputMaybe<ModelColonyActionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListColonyExtensionsArgs = {
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListColonyFundsClaimsArgs = {
  filter?: InputMaybe<ModelColonyFundsClaimFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListColonyHistoricRolesArgs = {
  filter?: InputMaybe<ModelColonyHistoricRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListColonyMetadataArgs = {
  filter?: InputMaybe<ModelColonyMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListColonyMotionsArgs = {
  filter?: InputMaybe<ModelColonyMotionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListColonyRolesArgs = {
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListColonyStakesArgs = {
  filter?: InputMaybe<ModelColonyStakeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListColonyTokensArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListContractEventsArgs = {
  filter?: InputMaybe<ModelContractEventFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListCurrentNetworkInverseFeesArgs = {
  filter?: InputMaybe<ModelCurrentNetworkInverseFeeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListCurrentVersionsArgs = {
  filter?: InputMaybe<ModelCurrentVersionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListDomainMetadataArgs = {
  filter?: InputMaybe<ModelDomainMetadataFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListDomainsArgs = {
  filter?: InputMaybe<ModelDomainFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListExpendituresArgs = {
  filter?: InputMaybe<ModelExpenditureFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListIngestorStatsArgs = {
  filter?: InputMaybe<ModelIngestorStatsFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListMotionMessagesArgs = {
  filter?: InputMaybe<ModelMotionMessageFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListProfilesArgs = {
  filter?: InputMaybe<ModelProfileFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListTokensArgs = {
  filter?: InputMaybe<ModelTokenFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListUserTokensArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListUsersArgs = {
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


/** Root query type */
export type QueryListWatchedColoniesArgs = {
  filter?: InputMaybe<ModelWatchedColoniesFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};

/**
 * Input data to store the latest available version of the core Colony contract and available extensions
 *
 * The extension hash is generated like so: `keccak256(toUtf8Bytes(extensionName))`, where `extensionName` is the name of the extension contract file in the Colony Network (e.g. `VotingReputation`)
 */
export type SetCurrentVersionInput = {
  /** COLONY for the Colony contract, extension hash for extensions */
  key: Scalars['String'];
  /** Latest available version */
  version: Scalars['Int'];
};

/** Variants of sorting methods for a member list */
export enum SortingMethod {
  /** Sort members by highest reputation */
  ByHighestRep = 'BY_HIGHEST_REP',
  /** Sort members by having fewer permissions */
  ByLessPermissions = 'BY_LESS_PERMISSIONS',
  /** Sort members by lowest reputation */
  ByLowestRep = 'BY_LOWEST_REP',
  /** Sort members by having more permissions */
  ByMorePermissions = 'BY_MORE_PERMISSIONS'
}

/** Staker rewards of a user for a motion */
export type StakerRewards = {
  __typename?: 'StakerRewards';
  /** The user's wallet address */
  address: Scalars['String'];
  /** Whether the voter reward is already claimed or not */
  isClaimed: Scalars['Boolean'];
  /** Rewards associated with the staked sides of a motion */
  rewards: MotionStakeValues;
};

/** Input used to modify the staker rewards of a user for a motion */
export type StakerRewardsInput = {
  /** The user's wallet address */
  address: Scalars['String'];
  /** Whether the voter reward is already claimed or not */
  isClaimed: Scalars['Boolean'];
  /** Rewards associated with the staked sides of a motion */
  rewards: MotionStakeValuesInput;
};

export type Subscription = {
  __typename?: 'Subscription';
  onCreateAnnotation?: Maybe<Annotation>;
  onCreateColony?: Maybe<Colony>;
  onCreateColonyAction?: Maybe<ColonyAction>;
  onCreateColonyExtension?: Maybe<ColonyExtension>;
  onCreateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onCreateColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  onCreateColonyMetadata?: Maybe<ColonyMetadata>;
  onCreateColonyMotion?: Maybe<ColonyMotion>;
  onCreateColonyRole?: Maybe<ColonyRole>;
  onCreateColonyStake?: Maybe<ColonyStake>;
  onCreateColonyTokens?: Maybe<ColonyTokens>;
  onCreateContractEvent?: Maybe<ContractEvent>;
  onCreateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onCreateCurrentVersion?: Maybe<CurrentVersion>;
  onCreateDomain?: Maybe<Domain>;
  onCreateDomainMetadata?: Maybe<DomainMetadata>;
  onCreateExpenditure?: Maybe<Expenditure>;
  onCreateIngestorStats?: Maybe<IngestorStats>;
  onCreateMotionMessage?: Maybe<MotionMessage>;
  onCreateProfile?: Maybe<Profile>;
  onCreateToken?: Maybe<Token>;
  onCreateUser?: Maybe<User>;
  onCreateUserTokens?: Maybe<UserTokens>;
  onCreateWatchedColonies?: Maybe<WatchedColonies>;
  onDeleteAnnotation?: Maybe<Annotation>;
  onDeleteColony?: Maybe<Colony>;
  onDeleteColonyAction?: Maybe<ColonyAction>;
  onDeleteColonyExtension?: Maybe<ColonyExtension>;
  onDeleteColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onDeleteColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  onDeleteColonyMetadata?: Maybe<ColonyMetadata>;
  onDeleteColonyMotion?: Maybe<ColonyMotion>;
  onDeleteColonyRole?: Maybe<ColonyRole>;
  onDeleteColonyStake?: Maybe<ColonyStake>;
  onDeleteColonyTokens?: Maybe<ColonyTokens>;
  onDeleteContractEvent?: Maybe<ContractEvent>;
  onDeleteCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onDeleteCurrentVersion?: Maybe<CurrentVersion>;
  onDeleteDomain?: Maybe<Domain>;
  onDeleteDomainMetadata?: Maybe<DomainMetadata>;
  onDeleteExpenditure?: Maybe<Expenditure>;
  onDeleteIngestorStats?: Maybe<IngestorStats>;
  onDeleteMotionMessage?: Maybe<MotionMessage>;
  onDeleteProfile?: Maybe<Profile>;
  onDeleteToken?: Maybe<Token>;
  onDeleteUser?: Maybe<User>;
  onDeleteUserTokens?: Maybe<UserTokens>;
  onDeleteWatchedColonies?: Maybe<WatchedColonies>;
  onUpdateAnnotation?: Maybe<Annotation>;
  onUpdateColony?: Maybe<Colony>;
  onUpdateColonyAction?: Maybe<ColonyAction>;
  onUpdateColonyExtension?: Maybe<ColonyExtension>;
  onUpdateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onUpdateColonyHistoricRole?: Maybe<ColonyHistoricRole>;
  onUpdateColonyMetadata?: Maybe<ColonyMetadata>;
  onUpdateColonyMotion?: Maybe<ColonyMotion>;
  onUpdateColonyRole?: Maybe<ColonyRole>;
  onUpdateColonyStake?: Maybe<ColonyStake>;
  onUpdateColonyTokens?: Maybe<ColonyTokens>;
  onUpdateContractEvent?: Maybe<ContractEvent>;
  onUpdateCurrentNetworkInverseFee?: Maybe<CurrentNetworkInverseFee>;
  onUpdateCurrentVersion?: Maybe<CurrentVersion>;
  onUpdateDomain?: Maybe<Domain>;
  onUpdateDomainMetadata?: Maybe<DomainMetadata>;
  onUpdateExpenditure?: Maybe<Expenditure>;
  onUpdateIngestorStats?: Maybe<IngestorStats>;
  onUpdateMotionMessage?: Maybe<MotionMessage>;
  onUpdateProfile?: Maybe<Profile>;
  onUpdateToken?: Maybe<Token>;
  onUpdateUser?: Maybe<User>;
  onUpdateUserTokens?: Maybe<UserTokens>;
  onUpdateWatchedColonies?: Maybe<WatchedColonies>;
};


export type SubscriptionOnCreateAnnotationArgs = {
  filter?: InputMaybe<ModelSubscriptionAnnotationFilterInput>;
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


export type SubscriptionOnCreateColonyHistoricRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyHistoricRoleFilterInput>;
};


export type SubscriptionOnCreateColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};


export type SubscriptionOnCreateColonyMotionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMotionFilterInput>;
};


export type SubscriptionOnCreateColonyRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyRoleFilterInput>;
};


export type SubscriptionOnCreateColonyStakeArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyStakeFilterInput>;
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


export type SubscriptionOnCreateExpenditureArgs = {
  filter?: InputMaybe<ModelSubscriptionExpenditureFilterInput>;
};


export type SubscriptionOnCreateIngestorStatsArgs = {
  filter?: InputMaybe<ModelSubscriptionIngestorStatsFilterInput>;
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


export type SubscriptionOnDeleteAnnotationArgs = {
  filter?: InputMaybe<ModelSubscriptionAnnotationFilterInput>;
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


export type SubscriptionOnDeleteColonyHistoricRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyHistoricRoleFilterInput>;
};


export type SubscriptionOnDeleteColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};


export type SubscriptionOnDeleteColonyMotionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMotionFilterInput>;
};


export type SubscriptionOnDeleteColonyRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyRoleFilterInput>;
};


export type SubscriptionOnDeleteColonyStakeArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyStakeFilterInput>;
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


export type SubscriptionOnDeleteExpenditureArgs = {
  filter?: InputMaybe<ModelSubscriptionExpenditureFilterInput>;
};


export type SubscriptionOnDeleteIngestorStatsArgs = {
  filter?: InputMaybe<ModelSubscriptionIngestorStatsFilterInput>;
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


export type SubscriptionOnUpdateAnnotationArgs = {
  filter?: InputMaybe<ModelSubscriptionAnnotationFilterInput>;
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


export type SubscriptionOnUpdateColonyHistoricRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyHistoricRoleFilterInput>;
};


export type SubscriptionOnUpdateColonyMetadataArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMetadataFilterInput>;
};


export type SubscriptionOnUpdateColonyMotionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyMotionFilterInput>;
};


export type SubscriptionOnUpdateColonyRoleArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyRoleFilterInput>;
};


export type SubscriptionOnUpdateColonyStakeArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyStakeFilterInput>;
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


export type SubscriptionOnUpdateExpenditureArgs = {
  filter?: InputMaybe<ModelSubscriptionExpenditureFilterInput>;
};


export type SubscriptionOnUpdateIngestorStatsArgs = {
  filter?: InputMaybe<ModelSubscriptionIngestorStatsFilterInput>;
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

/** Represents an ERC20-compatible token that is used by Colonies and users */
export type Token = {
  __typename?: 'Token';
  /** URL of the token's avatar image (logo) */
  avatar?: Maybe<Scalars['String']>;
  /** Metadata related to the chain of the token */
  chainMetadata: ChainMetadata;
  colonies?: Maybe<ModelColonyTokensConnection>;
  /** Timestamp of the token model's creation in the database */
  createdAt: Scalars['AWSDateTime'];
  /** Decimal precision of the token */
  decimals: Scalars['Int'];
  /** Unique identifier for the token (contract address) */
  id: Scalars['ID'];
  /** Name of the token */
  name: Scalars['String'];
  /** Symbol of the token */
  symbol: Scalars['String'];
  /** URL of the token's thumbnail image (Small logo) */
  thumbnail?: Maybe<Scalars['String']>;
  /** Type of the token. See `TokenType` for more information */
  type?: Maybe<TokenType>;
  updatedAt: Scalars['AWSDateTime'];
  users?: Maybe<ModelUserTokensConnection>;
};


/** Represents an ERC20-compatible token that is used by Colonies and users */
export type TokenColoniesArgs = {
  filter?: InputMaybe<ModelColonyTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents an ERC20-compatible token that is used by Colonies and users */
export type TokenUsersArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** Input data for fetching a token's information from DB or chain */
export type TokenFromEverywhereArguments = {
  /** Address of the token on the blockchain */
  tokenAddress: Scalars['String'];
};

/** Return type for tokens gotten from DB or from chain */
export type TokenFromEverywhereReturn = {
  __typename?: 'TokenFromEverywhereReturn';
  /** List of tokens found */
  items?: Maybe<Array<Maybe<Token>>>;
};

/** Input type for specifying a Token */
export type TokenInput = {
  /** Unique identifier for the Token */
  id: Scalars['ID'];
};

/**
 * Variants of different token types a Colony can use
 * As Colonies can use multiple tokens and even own tokens (BYOT), we need to differentiate
 */
export enum TokenType {
  /** The native token of the Chain used (e.g. ETH on mainnet or xDAI on Gnosis-Chain) */
  ChainNative = 'CHAIN_NATIVE',
  /** A (ERC20-compatible) token that was deployed with Colony. It has a few more features, like minting through the Colony itself */
  Colony = 'COLONY',
  /** An ERC20-compatible token */
  Erc20 = 'ERC20'
}

export type UpdateAnnotationInput = {
  actionId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  ipfsHash?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
};

export type UpdateColonyActionInput = {
  amount?: InputMaybe<Scalars['String']>;
  annotationId?: InputMaybe<Scalars['ID']>;
  blockNumber?: InputMaybe<Scalars['Int']>;
  colonyActionsId?: InputMaybe<Scalars['ID']>;
  colonyId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  fromDomainId?: InputMaybe<Scalars['ID']>;
  fundamentalChainId?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  individualEvents?: InputMaybe<Scalars['String']>;
  initiatorAddress?: InputMaybe<Scalars['ID']>;
  isMotion?: InputMaybe<Scalars['Boolean']>;
  motionDomainId?: InputMaybe<Scalars['Int']>;
  motionId?: InputMaybe<Scalars['ID']>;
  newColonyVersion?: InputMaybe<Scalars['Int']>;
  pendingColonyMetadataId?: InputMaybe<Scalars['ID']>;
  pendingDomainMetadataId?: InputMaybe<Scalars['ID']>;
  recipientAddress?: InputMaybe<Scalars['ID']>;
  roles?: InputMaybe<ColonyActionRolesInput>;
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

export type UpdateColonyHistoricRoleInput = {
  blockNumber?: InputMaybe<Scalars['Int']>;
  colonyId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  domainId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
  targetAddress?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<Scalars['String']>;
};

export type UpdateColonyInput = {
  balances?: InputMaybe<ColonyBalancesInput>;
  chainFundsClaim?: InputMaybe<ColonyChainFundsClaimInput>;
  chainMetadata?: InputMaybe<ChainMetadataInput>;
  expendituresGlobalClaimDelay?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  motionsWithUnclaimedStakes?: InputMaybe<Array<ColonyUnclaimedStakeInput>>;
  name?: InputMaybe<Scalars['String']>;
  nativeTokenId?: InputMaybe<Scalars['ID']>;
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

export type UpdateColonyMotionInput = {
  createdBy?: InputMaybe<Scalars['String']>;
  hasObjection?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  isFinalized?: InputMaybe<Scalars['Boolean']>;
  motionDomainId?: InputMaybe<Scalars['ID']>;
  motionStakes?: InputMaybe<MotionStakesInput>;
  motionStateHistory?: InputMaybe<MotionStateHistoryInput>;
  nativeMotionDomainId?: InputMaybe<Scalars['String']>;
  nativeMotionId?: InputMaybe<Scalars['String']>;
  objectionAnnotationId?: InputMaybe<Scalars['ID']>;
  remainingStakes?: InputMaybe<Array<Scalars['String']>>;
  repSubmitted?: InputMaybe<Scalars['String']>;
  requiredStake?: InputMaybe<Scalars['String']>;
  revealedVotes?: InputMaybe<MotionStakesInput>;
  rootHash?: InputMaybe<Scalars['String']>;
  skillRep?: InputMaybe<Scalars['String']>;
  stakerRewards?: InputMaybe<Array<StakerRewardsInput>>;
  userMinStake?: InputMaybe<Scalars['String']>;
  usersStakes?: InputMaybe<Array<UserStakesInput>>;
  voterRecord?: InputMaybe<Array<VoterRecordInput>>;
};

export type UpdateColonyRoleInput = {
  colonyRolesId?: InputMaybe<Scalars['ID']>;
  domainId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  latestBlock?: InputMaybe<Scalars['Int']>;
  role_0?: InputMaybe<Scalars['Boolean']>;
  role_1?: InputMaybe<Scalars['Boolean']>;
  role_2?: InputMaybe<Scalars['Boolean']>;
  role_3?: InputMaybe<Scalars['Boolean']>;
  role_5?: InputMaybe<Scalars['Boolean']>;
  role_6?: InputMaybe<Scalars['Boolean']>;
  targetAddress?: InputMaybe<Scalars['ID']>;
};

export type UpdateColonyStakeInput = {
  colonyId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  totalAmount?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
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

export type UpdateExpenditureInput = {
  colonyExpendituresId?: InputMaybe<Scalars['ID']>;
  colonyId?: InputMaybe<Scalars['ID']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  ownerAddress?: InputMaybe<Scalars['ID']>;
  slots?: InputMaybe<Array<ExpenditureSlotInput>>;
  status?: InputMaybe<ExpenditureStatus>;
};

/**
 * Input data for updating an extension's information within a Colony, based on the Colony ID and extension hash
 * The hash is generated like so: `keccak256(toUtf8Bytes(extensionName))`, where `extensionName` is the name of the extension contract file in the Colony Network
 */
export type UpdateExtensionByColonyAndHashInput = {
  /** The unique identifier for the Colony */
  colonyId: Scalars['ID'];
  /** The hash of the extension to be updated */
  hash: Scalars['String'];
  /** The timestamp when the extension was installed */
  installedAt?: InputMaybe<Scalars['AWSTimestamp']>;
  /** The Ethereum address of the user who installed the extension */
  installedBy?: InputMaybe<Scalars['String']>;
  /** A flag to indicate whether the extension is deleted */
  isDeleted?: InputMaybe<Scalars['Boolean']>;
  /** A flag to indicate whether the extension is deprecated */
  isDeprecated?: InputMaybe<Scalars['Boolean']>;
  /** A flag to indicate whether the extension is initialized */
  isInitialized?: InputMaybe<Scalars['Boolean']>;
  /** The version of the extension */
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateIngestorStatsInput = {
  id: Scalars['ID'];
  value?: InputMaybe<Scalars['String']>;
};

export type UpdateMotionMessageInput = {
  amount?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  id: Scalars['ID'];
  initiatorAddress?: InputMaybe<Scalars['ID']>;
  messageKey?: InputMaybe<Scalars['String']>;
  motionId?: InputMaybe<Scalars['ID']>;
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

/** Represents a User within the Colony Network */
export type User = {
  __typename?: 'User';
  createdAt: Scalars['AWSDateTime'];
  /** Unique identifier for the user (wallet address) */
  id: Scalars['ID'];
  /** (Short) name of the user */
  name: Scalars['String'];
  /** Profile information of the user */
  profile?: Maybe<Profile>;
  /** Profile ID associated with the user */
  profileId?: Maybe<Scalars['ID']>;
  roles?: Maybe<ModelColonyRoleConnection>;
  stakes?: Maybe<ModelColonyStakeConnection>;
  tokens?: Maybe<ModelUserTokensConnection>;
  updatedAt: Scalars['AWSDateTime'];
  watchlist?: Maybe<ModelWatchedColoniesConnection>;
};


/** Represents a User within the Colony Network */
export type UserRolesArgs = {
  filter?: InputMaybe<ModelColonyRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents a User within the Colony Network */
export type UserStakesArgs = {
  colonyId?: InputMaybe<ModelIdKeyConditionInput>;
  filter?: InputMaybe<ModelColonyStakeFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents a User within the Colony Network */
export type UserTokensArgs = {
  filter?: InputMaybe<ModelUserTokensFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};


/** Represents a User within the Colony Network */
export type UserWatchlistArgs = {
  filter?: InputMaybe<ModelWatchedColoniesFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
};

/** A type representing a user's reputation within a domain */
export type UserDomainReputation = {
  __typename?: 'UserDomainReputation';
  /** The integer ID of the Domain within the Colony */
  domainId: Scalars['Int'];
  /** The user's reputation within the domain, represented as a percentage */
  reputationPercentage: Scalars['String'];
};

/** Stakes that a user has made for a motion */
export type UserStakes = {
  __typename?: 'UserStakes';
  /** The user's wallet address */
  address: Scalars['String'];
  /** Stake values */
  stakes: MotionStakes;
};

/** Input used to modify the stakes of a user for a motion */
export type UserStakesInput = {
  /** The user's wallet address */
  address: Scalars['String'];
  /** Stake values */
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

/** A voter record of a user for a motion */
export type VoterRecord = {
  __typename?: 'VoterRecord';
  /** The user's wallet address */
  address: Scalars['String'];
  /**
   * The actual vote (yay or nay)
   * nullable since we don't know the vote until it's revealed
   */
  vote?: Maybe<Scalars['Int']>;
  /** The voting weight denominated by the user's reputation */
  voteCount: Scalars['String'];
};

/** Input used to modify a voter record of a user for a motion */
export type VoterRecordInput = {
  /** The user's wallet address */
  address: Scalars['String'];
  /**
   * The actual vote (yay or nay)
   * nullable since we don't know the vote until it's revealed
   */
  vote?: InputMaybe<Scalars['Int']>;
  /** The voting weight denominated by the user's reputation */
  voteCount: Scalars['String'];
};

/**
 * A return type that contains the voting reward for a user and a motion
 * `min` and `max` specify the potential reward range when the actual reward is unknown (before the _reveal_ phase)
 */
export type VoterRewardsReturn = {
  __typename?: 'VoterRewardsReturn';
  /**
   * The maximum possible reward amount
   * Only useful before the _reveal_ phase, when the actual amount is known
   */
  max: Scalars['String'];
  /**
   * The minimum possible reward amount
   * Only useful before the _reveal_ phase, when the actual amount is known
   */
  min: Scalars['String'];
  /** The actual reward amount */
  reward: Scalars['String'];
};

/**
 * Parameters that were set when installing the VotingReputation extension
 * For more info see [here](https://docs.colony.io/colonysdk/api/classes/VotingReputation#extension-parameters)
 */
export type VotingReputationParams = {
  __typename?: 'VotingReputationParams';
  /** Time that the escalation period will last (in seconds) */
  escalationPeriod: Scalars['String'];
  /** Percentage of the total reputation that voted should end the voting period */
  maxVoteFraction: Scalars['String'];
  /** Time that the reveal period will last (in seconds) */
  revealPeriod: Scalars['String'];
  /** Time that the staking period will last (in seconds) */
  stakePeriod: Scalars['String'];
  /** Time that the voting period will last (in seconds) */
  submitPeriod: Scalars['String'];
  /** Percentage of the team's reputation that needs to be staked ot activate either side of the motion */
  totalStakeFraction: Scalars['String'];
  /** Minimum percentage of the total stake that each user has to provide */
  userMinStakeFraction: Scalars['String'];
  /** Percentage of the losing side's stake that is awarded to the voters */
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

/**
 * Represents a watcher within the Colony Network
 *
 * A watcher is a Colony member who doesn't have reputation
 */
export type Watcher = {
  __typename?: 'Watcher';
  /** Wallet address of the watcher */
  address: Scalars['String'];
  /** User data associated with the watcher */
  user?: Maybe<User>;
};

export type ColonyActionFragment = { __typename?: 'ColonyAction', type: ColonyActionType, blockNumber: number, initiatorAddress: string, recipientAddress?: string | null, amount?: string | null, tokenAddress?: string | null, createdAt: string, newColonyVersion?: number | null, individualEvents?: string | null, isMotion?: boolean | null, showInActionsList: boolean, transactionHash: string, colonyAddress: string, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', displayName?: string | null, avatar?: string | null, thumbnail?: string | null } | null } | null, initiatorColony?: { __typename?: 'Colony', name: string, version: number, colonyAddress: string, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, motionsWithUnclaimedStakes?: Array<{ __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> }> | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, roles?: { __typename?: 'ModelColonyRoleConnection', items: Array<{ __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } } | null> } | null } | null, initiatorExtension?: { __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null } | null, initiatorToken?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, recipientUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', displayName?: string | null, avatar?: string | null, thumbnail?: string | null } | null } | null, recipientColony?: { __typename?: 'Colony', name: string, version: number, colonyAddress: string, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, motionsWithUnclaimedStakes?: Array<{ __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> }> | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, roles?: { __typename?: 'ModelColonyRoleConnection', items: Array<{ __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } } | null> } | null } | null, recipientExtension?: { __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null } | null, recipientToken?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, token?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, fromDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, toDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, roles?: { __typename?: 'ColonyActionRoles', role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null } | null, motionData?: { __typename?: 'ColonyMotion', remainingStakes: Array<string>, userMinStake: string, requiredStake: string, rootHash: string, nativeMotionDomainId: string, isFinalized: boolean, skillRep: string, repSubmitted: string, hasObjection: boolean, databaseMotionId: string, motionId: string, motionStakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, usersStakes: Array<{ __typename?: 'UserStakes', address: string, stakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } } }>, motionDomain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, stakerRewards: Array<{ __typename?: 'StakerRewards', address: string, isClaimed: boolean, rewards: { __typename?: 'MotionStakeValues', yay: string, nay: string } }>, voterRecord: Array<{ __typename?: 'VoterRecord', address: string, voteCount: string, vote?: number | null }>, revealedVotes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, motionStateHistory: { __typename?: 'MotionStateHistory', hasVoted: boolean, hasPassed: boolean, hasFailed: boolean, hasFailedNotFinalizable: boolean, inRevealPhase: boolean }, messages?: { __typename?: 'ModelMotionMessageConnection', items: Array<{ __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null } | null> } | null, objectionAnnotation?: { __typename?: 'Annotation', createdAt: string, message: string } | null } | null, colony: { __typename?: 'Colony', colonyAddress: string, nativeToken: { __typename?: 'Token', nativeTokenDecimals: number, nativeTokenSymbol: string, tokenAddress: string } }, pendingDomainMetadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null, pendingColonyMetadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, annotation?: { __typename?: 'Annotation', createdAt: string, message: string } | null };

export type AnnotationFragment = { __typename?: 'Annotation', createdAt: string, message: string };

export type MotionStakeValuesFragment = { __typename?: 'MotionStakeValues', yay: string, nay: string };

export type ColonyMotionFragment = { __typename?: 'ColonyMotion', remainingStakes: Array<string>, userMinStake: string, requiredStake: string, rootHash: string, nativeMotionDomainId: string, isFinalized: boolean, skillRep: string, repSubmitted: string, hasObjection: boolean, databaseMotionId: string, motionId: string, motionStakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, usersStakes: Array<{ __typename?: 'UserStakes', address: string, stakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } } }>, motionDomain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, stakerRewards: Array<{ __typename?: 'StakerRewards', address: string, isClaimed: boolean, rewards: { __typename?: 'MotionStakeValues', yay: string, nay: string } }>, voterRecord: Array<{ __typename?: 'VoterRecord', address: string, voteCount: string, vote?: number | null }>, revealedVotes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, motionStateHistory: { __typename?: 'MotionStateHistory', hasVoted: boolean, hasPassed: boolean, hasFailed: boolean, hasFailedNotFinalizable: boolean, inRevealPhase: boolean }, messages?: { __typename?: 'ModelMotionMessageConnection', items: Array<{ __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null } | null> } | null, objectionAnnotation?: { __typename?: 'Annotation', createdAt: string, message: string } | null };

export type MotionMessageFragment = { __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null };

export type VoterRecordFragment = { __typename?: 'VoterRecord', address: string, voteCount: string, vote?: number | null };

export type MotionStakesFragment = { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } };

export type ColonyFragment = { __typename?: 'Colony', name: string, version: number, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, motionsWithUnclaimedStakes?: Array<{ __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> }> | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, roles?: { __typename?: 'ModelColonyRoleConnection', items: Array<{ __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } } | null> } | null };

export type ColonyDisplayFragment = { __typename?: 'Colony', name: string, colonyAddress: string, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null } | null };

export type ColonyTokensConnectionFragment = { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> };

export type UnclaimedStakesFragment = { __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> };

export type WatchedColonyFragment = { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null };

export type WatchListItemFragment = { __typename?: 'WatchedColonies', createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } };

export type ColonyMetadataFragment = { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null };

export type ColonyBalancesFragment = { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null };

export type ColonyBalanceFragment = { __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } };

export type FundsClaimFragment = { __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } };

export type ChainFundsClaimFragment = { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string };

export type ColonyRoleFragment = { __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } };

export type DomainFragment = { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null };

export type DomainMetadataFragment = { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null };

export type ExtensionFragment = { __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null };

export type ExtensionDisplayFragmentFragment = { __typename?: 'ColonyExtension', hash: string, address: string };

export type TokenFragment = { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string };

export type UserTokenBalanceDataFragment = { __typename?: 'GetUserTokenBalanceReturn', balance?: string | null, inactiveBalance?: string | null, lockedBalance?: string | null, activeBalance?: string | null, pendingBalance?: string | null };

export type UserFragment = { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null };

export type UserDisplayFragment = { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', displayName?: string | null, avatar?: string | null, thumbnail?: string | null } | null };

export type ProfileFragment = { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null };

export type MemberUserFragment = { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null };

export type ContributorFragment = { __typename?: 'Contributor', address: string, reputationPercentage?: string | null, reputationAmount?: string | null, user?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null } | null };

export type WatcherFragment = { __typename?: 'Watcher', address: string, user?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null } | null };

export type CreateAnnotationMutationVariables = Exact<{
  input: CreateAnnotationInput;
}>;


export type CreateAnnotationMutation = { __typename?: 'Mutation', createAnnotation?: { __typename?: 'Annotation', id: string } | null };

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


export type GetColonyActionsQuery = { __typename?: 'Query', getActionsByColony?: { __typename?: 'ModelColonyActionConnection', nextToken?: string | null, items: Array<{ __typename?: 'ColonyAction', type: ColonyActionType, blockNumber: number, initiatorAddress: string, recipientAddress?: string | null, amount?: string | null, tokenAddress?: string | null, createdAt: string, newColonyVersion?: number | null, individualEvents?: string | null, isMotion?: boolean | null, showInActionsList: boolean, transactionHash: string, colonyAddress: string, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', displayName?: string | null, avatar?: string | null, thumbnail?: string | null } | null } | null, initiatorColony?: { __typename?: 'Colony', name: string, version: number, colonyAddress: string, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, motionsWithUnclaimedStakes?: Array<{ __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> }> | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, roles?: { __typename?: 'ModelColonyRoleConnection', items: Array<{ __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } } | null> } | null } | null, initiatorExtension?: { __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null } | null, initiatorToken?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, recipientUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', displayName?: string | null, avatar?: string | null, thumbnail?: string | null } | null } | null, recipientColony?: { __typename?: 'Colony', name: string, version: number, colonyAddress: string, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, motionsWithUnclaimedStakes?: Array<{ __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> }> | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, roles?: { __typename?: 'ModelColonyRoleConnection', items: Array<{ __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } } | null> } | null } | null, recipientExtension?: { __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null } | null, recipientToken?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, token?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, fromDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, toDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, roles?: { __typename?: 'ColonyActionRoles', role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null } | null, motionData?: { __typename?: 'ColonyMotion', remainingStakes: Array<string>, userMinStake: string, requiredStake: string, rootHash: string, nativeMotionDomainId: string, isFinalized: boolean, skillRep: string, repSubmitted: string, hasObjection: boolean, databaseMotionId: string, motionId: string, motionStakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, usersStakes: Array<{ __typename?: 'UserStakes', address: string, stakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } } }>, motionDomain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, stakerRewards: Array<{ __typename?: 'StakerRewards', address: string, isClaimed: boolean, rewards: { __typename?: 'MotionStakeValues', yay: string, nay: string } }>, voterRecord: Array<{ __typename?: 'VoterRecord', address: string, voteCount: string, vote?: number | null }>, revealedVotes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, motionStateHistory: { __typename?: 'MotionStateHistory', hasVoted: boolean, hasPassed: boolean, hasFailed: boolean, hasFailedNotFinalizable: boolean, inRevealPhase: boolean }, messages?: { __typename?: 'ModelMotionMessageConnection', items: Array<{ __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null } | null> } | null, objectionAnnotation?: { __typename?: 'Annotation', createdAt: string, message: string } | null } | null, colony: { __typename?: 'Colony', colonyAddress: string, nativeToken: { __typename?: 'Token', nativeTokenDecimals: number, nativeTokenSymbol: string, tokenAddress: string } }, pendingDomainMetadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null, pendingColonyMetadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, annotation?: { __typename?: 'Annotation', createdAt: string, message: string } | null } | null> } | null };

export type GetColonyActionQueryVariables = Exact<{
  transactionHash: Scalars['ID'];
}>;


export type GetColonyActionQuery = { __typename?: 'Query', getColonyAction?: { __typename?: 'ColonyAction', type: ColonyActionType, blockNumber: number, initiatorAddress: string, recipientAddress?: string | null, amount?: string | null, tokenAddress?: string | null, createdAt: string, newColonyVersion?: number | null, individualEvents?: string | null, isMotion?: boolean | null, showInActionsList: boolean, transactionHash: string, colonyAddress: string, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', displayName?: string | null, avatar?: string | null, thumbnail?: string | null } | null } | null, initiatorColony?: { __typename?: 'Colony', name: string, version: number, colonyAddress: string, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, motionsWithUnclaimedStakes?: Array<{ __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> }> | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, roles?: { __typename?: 'ModelColonyRoleConnection', items: Array<{ __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } } | null> } | null } | null, initiatorExtension?: { __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null } | null, initiatorToken?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, recipientUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', displayName?: string | null, avatar?: string | null, thumbnail?: string | null } | null } | null, recipientColony?: { __typename?: 'Colony', name: string, version: number, colonyAddress: string, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, motionsWithUnclaimedStakes?: Array<{ __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> }> | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, roles?: { __typename?: 'ModelColonyRoleConnection', items: Array<{ __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } } | null> } | null } | null, recipientExtension?: { __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null } | null, recipientToken?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, token?: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } | null, fromDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, toDomain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, roles?: { __typename?: 'ColonyActionRoles', role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null } | null, motionData?: { __typename?: 'ColonyMotion', remainingStakes: Array<string>, userMinStake: string, requiredStake: string, rootHash: string, nativeMotionDomainId: string, isFinalized: boolean, skillRep: string, repSubmitted: string, hasObjection: boolean, databaseMotionId: string, motionId: string, motionStakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, usersStakes: Array<{ __typename?: 'UserStakes', address: string, stakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } } }>, motionDomain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, stakerRewards: Array<{ __typename?: 'StakerRewards', address: string, isClaimed: boolean, rewards: { __typename?: 'MotionStakeValues', yay: string, nay: string } }>, voterRecord: Array<{ __typename?: 'VoterRecord', address: string, voteCount: string, vote?: number | null }>, revealedVotes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, motionStateHistory: { __typename?: 'MotionStateHistory', hasVoted: boolean, hasPassed: boolean, hasFailed: boolean, hasFailedNotFinalizable: boolean, inRevealPhase: boolean }, messages?: { __typename?: 'ModelMotionMessageConnection', items: Array<{ __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null } | null> } | null, objectionAnnotation?: { __typename?: 'Annotation', createdAt: string, message: string } | null } | null, colony: { __typename?: 'Colony', colonyAddress: string, nativeToken: { __typename?: 'Token', nativeTokenDecimals: number, nativeTokenSymbol: string, tokenAddress: string } }, pendingDomainMetadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null, pendingColonyMetadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, annotation?: { __typename?: 'Annotation', createdAt: string, message: string } | null } | null };

export type GetColonyMotionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetColonyMotionQuery = { __typename?: 'Query', getColonyMotion?: { __typename?: 'ColonyMotion', remainingStakes: Array<string>, userMinStake: string, requiredStake: string, rootHash: string, nativeMotionDomainId: string, isFinalized: boolean, skillRep: string, repSubmitted: string, hasObjection: boolean, databaseMotionId: string, motionId: string, motionStakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, usersStakes: Array<{ __typename?: 'UserStakes', address: string, stakes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } } }>, motionDomain: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null }, stakerRewards: Array<{ __typename?: 'StakerRewards', address: string, isClaimed: boolean, rewards: { __typename?: 'MotionStakeValues', yay: string, nay: string } }>, voterRecord: Array<{ __typename?: 'VoterRecord', address: string, voteCount: string, vote?: number | null }>, revealedVotes: { __typename?: 'MotionStakes', raw: { __typename?: 'MotionStakeValues', yay: string, nay: string }, percentage: { __typename?: 'MotionStakeValues', yay: string, nay: string } }, motionStateHistory: { __typename?: 'MotionStateHistory', hasVoted: boolean, hasPassed: boolean, hasFailed: boolean, hasFailedNotFinalizable: boolean, inRevealPhase: boolean }, messages?: { __typename?: 'ModelMotionMessageConnection', items: Array<{ __typename?: 'MotionMessage', initiatorAddress: string, name: string, messageKey: string, vote?: string | null, amount?: string | null, initiatorUser?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null } | null> } | null, objectionAnnotation?: { __typename?: 'Annotation', createdAt: string, message: string } | null } | null };

export type GetMotionTransactionHashQueryVariables = Exact<{
  motionId: Scalars['ID'];
}>;


export type GetMotionTransactionHashQuery = { __typename?: 'Query', getColonyActionByMotionId?: { __typename?: 'ModelColonyActionConnection', items: Array<{ __typename?: 'ColonyAction', id: string } | null> } | null };

export type GetFullColonyByAddressQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type GetFullColonyByAddressQuery = { __typename?: 'Query', getColonyByAddress?: { __typename?: 'ModelColonyConnection', items: Array<{ __typename?: 'Colony', name: string, version: number, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, motionsWithUnclaimedStakes?: Array<{ __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> }> | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, roles?: { __typename?: 'ModelColonyRoleConnection', items: Array<{ __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } } | null> } | null } | null> } | null };

export type GetFullColonyByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetFullColonyByNameQuery = { __typename?: 'Query', getColonyByName?: { __typename?: 'ModelColonyConnection', items: Array<{ __typename?: 'Colony', name: string, version: number, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, motionsWithUnclaimedStakes?: Array<{ __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> }> | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, roles?: { __typename?: 'ModelColonyRoleConnection', items: Array<{ __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } } | null> } | null } | null> } | null };

export type GetDisplayNameByColonyNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetDisplayNameByColonyNameQuery = { __typename?: 'Query', getColonyByName?: { __typename?: 'ModelColonyConnection', items: Array<{ __typename?: 'Colony', metadata?: { __typename?: 'ColonyMetadata', displayName: string } | null } | null> } | null };

export type GetMetacolonyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMetacolonyQuery = { __typename?: 'Query', getColonyByType?: { __typename?: 'ModelColonyConnection', items: Array<{ __typename?: 'Colony', name: string, version: number, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string }, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', colonyTokensId: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, motionsWithUnclaimedStakes?: Array<{ __typename?: 'ColonyUnclaimedStake', motionId: string, unclaimedRewards: Array<{ __typename?: 'StakerRewards', address: string, rewards: { __typename?: 'MotionStakeValues', nay: string, yay: string } }> }> | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null> } | null, balances?: { __typename?: 'ColonyBalances', items?: Array<{ __typename?: 'ColonyBalance', id: string, balance: string, domain?: { __typename?: 'Domain', id: string, nativeId: number, isRoot: boolean, nativeFundingPotId: number, metadata?: { __typename?: 'DomainMetadata', name: string, color: DomainColor, description: string, changelog?: Array<{ __typename?: 'DomainMetadataChangelog', transactionHash: string, oldName: string, newName: string, oldColor: DomainColor, newColor: DomainColor, oldDescription: string, newDescription: string }> | null } | null } | null, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> | null } | null, fundsClaims?: { __typename?: 'ModelColonyFundsClaimConnection', items: Array<{ __typename?: 'ColonyFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string, token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, avatar?: string | null, thumbnail?: string | null, tokenAddress: string } } | null> } | null, chainFundsClaim?: { __typename?: 'ColonyChainFundsClaim', id: string, createdAtBlock: number, createdAt: string, amount: string } | null, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null, roles?: { __typename?: 'ModelColonyRoleConnection', items: Array<{ __typename?: 'ColonyRole', id: string, targetAddress?: string | null, role_0?: boolean | null, role_1?: boolean | null, role_2?: boolean | null, role_3?: boolean | null, role_5?: boolean | null, role_6?: boolean | null, domain: { __typename?: 'Domain', nativeId: number } } | null> } | null } | null> } | null };

export type GetColonyExtensionsQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
}>;


export type GetColonyExtensionsQuery = { __typename?: 'Query', getColony?: { __typename?: 'Colony', extensions?: { __typename?: 'ModelColonyExtensionConnection', items: Array<{ __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null } | null> } | null } | null };

export type GetColonyExtensionQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
  extensionHash: Scalars['String'];
}>;


export type GetColonyExtensionQuery = { __typename?: 'Query', getExtensionByColonyAndHash?: { __typename?: 'ModelColonyExtensionConnection', items: Array<{ __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number, params?: { __typename?: 'ExtensionParams', votingReputation?: { __typename?: 'VotingReputationParams', maxVoteFraction: string } | null } | null } | null> } | null };

export type GetMembersForColonyQueryVariables = Exact<{
  input: MembersForColonyInput;
}>;


export type GetMembersForColonyQuery = { __typename?: 'Query', getMembersForColony?: { __typename?: 'MembersForColonyReturn', contributors?: Array<{ __typename?: 'Contributor', address: string, reputationPercentage?: string | null, reputationAmount?: string | null, user?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null } | null }> | null, watchers?: Array<{ __typename?: 'Watcher', address: string, user?: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null } | null }> | null } | null };

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


export type GetUserByAddressQuery = { __typename?: 'Query', getUserByAddress?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null> } | null };

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


export type GetUserByNameQuery = { __typename?: 'Query', getUserByName?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null> } | null };

export type CombinedUserQueryVariables = Exact<{
  name: Scalars['String'];
  address: Scalars['ID'];
}>;


export type CombinedUserQuery = { __typename?: 'Query', getUserByAddress?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null> } | null, getUserByName?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null> } | null };

export type GetUsersQueryVariables = Exact<{
  filter?: InputMaybe<ModelUserFilterInput>;
}>;


export type GetUsersQuery = { __typename?: 'Query', listUsers?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: string | null, location?: string | null, thumbnail?: string | null, website?: string | null, meta?: { __typename?: 'ProfileMetadata', emailPermissions: Array<string>, metatransactionsEnabled?: boolean | null, decentralizedModeEnabled?: boolean | null, customRpc?: string | null } | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', id: string, createdAt: string, colony: { __typename?: 'Colony', name: string, colonyAddress: string, chainMetadata: { __typename?: 'ChainMetadata', chainId: number }, metadata?: { __typename?: 'ColonyMetadata', displayName: string, avatar?: string | null, thumbnail?: string | null, isWhitelistActivated?: boolean | null, whitelistedAddresses?: Array<string> | null, changelog?: Array<{ __typename?: 'ColonyMetadataChangelog', transactionHash: string, newDisplayName: string, oldDisplayName: string, hasAvatarChanged: boolean, hasWhitelistChanged: boolean, haveTokensChanged: boolean }> | null } | null } } | null> } | null } | null> } | null };

export type GetCurrentExtensionsVersionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentExtensionsVersionsQuery = { __typename?: 'Query', listCurrentVersions?: { __typename?: 'ModelCurrentVersionConnection', items: Array<{ __typename?: 'CurrentVersion', version: number, extensionHash: string } | null> } | null };

export type GetCurrentExtensionVersionQueryVariables = Exact<{
  extensionHash: Scalars['String'];
}>;


export type GetCurrentExtensionVersionQuery = { __typename?: 'Query', getCurrentVersionByKey?: { __typename?: 'ModelCurrentVersionConnection', items: Array<{ __typename?: 'CurrentVersion', version: number, extensionHash: string } | null> } | null };

export type GetCurrentColonyVersionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentColonyVersionQuery = { __typename?: 'Query', getCurrentVersionByKey?: { __typename?: 'ModelCurrentVersionConnection', items: Array<{ __typename?: 'CurrentVersion', version: number } | null> } | null };

export const UserDisplayFragmentDoc = gql`
    fragment UserDisplay on User {
  walletAddress: id
  name
  profile {
    displayName
    avatar
    thumbnail
  }
}
    `;
export const ColonyDisplayFragmentDoc = gql`
    fragment ColonyDisplay on Colony {
  colonyAddress: id
  name
  metadata {
    displayName
    avatar
    thumbnail
  }
}
    `;
export const ExtensionDisplayFragmentFragmentDoc = gql`
    fragment ExtensionDisplayFragment on ColonyExtension {
  address: id
  hash
}
    `;
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
export const ColonyTokensConnectionFragmentDoc = gql`
    fragment ColonyTokensConnection on ModelColonyTokensConnection {
  items {
    colonyTokensId: id
    token {
      ...Token
    }
  }
}
    ${TokenFragmentDoc}`;
export const UnclaimedStakesFragmentDoc = gql`
    fragment UnclaimedStakes on ColonyUnclaimedStake {
  motionId
  unclaimedRewards {
    address
    rewards {
      nay
      yay
    }
  }
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
export const ColonyRoleFragmentDoc = gql`
    fragment ColonyRole on ColonyRole {
  id
  domain {
    nativeId
  }
  targetAddress
  role_0
  role_1
  role_2
  role_3
  role_5
  role_6
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
  }
  tokens {
    ...ColonyTokensConnection
  }
  motionsWithUnclaimedStakes {
    ...UnclaimedStakes
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
  roles {
    items {
      ...ColonyRole
    }
  }
}
    ${TokenFragmentDoc}
${ColonyTokensConnectionFragmentDoc}
${UnclaimedStakesFragmentDoc}
${DomainFragmentDoc}
${ColonyBalancesFragmentDoc}
${FundsClaimFragmentDoc}
${ChainFundsClaimFragmentDoc}
${ColonyMetadataFragmentDoc}
${ColonyRoleFragmentDoc}`;
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
export const MotionStakeValuesFragmentDoc = gql`
    fragment MotionStakeValues on MotionStakeValues {
  yay
  nay
}
    `;
export const MotionStakesFragmentDoc = gql`
    fragment MotionStakes on MotionStakes {
  raw {
    ...MotionStakeValues
  }
  percentage {
    ...MotionStakeValues
  }
}
    ${MotionStakeValuesFragmentDoc}`;
export const VoterRecordFragmentDoc = gql`
    fragment VoterRecord on VoterRecord {
  address
  voteCount
  vote
}
    `;
export const ProfileFragmentDoc = gql`
    fragment Profile on Profile {
  avatar
  bio
  displayName
  email
  location
  thumbnail
  website
  meta {
    emailPermissions
    metatransactionsEnabled
    decentralizedModeEnabled
    customRpc
  }
}
    `;
export const WatchedColonyFragmentDoc = gql`
    fragment WatchedColony on Colony {
  colonyAddress: id
  name
  chainMetadata {
    chainId
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
export const AnnotationFragmentDoc = gql`
    fragment Annotation on Annotation {
  createdAt
  message
}
    `;
export const ColonyMotionFragmentDoc = gql`
    fragment ColonyMotion on ColonyMotion {
  databaseMotionId: id
  motionId: nativeMotionId
  motionStakes {
    ...MotionStakes
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
  motionDomain {
    ...Domain
  }
  nativeMotionDomainId
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
    ...VoterRecord
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
    items {
      ...MotionMessage
    }
  }
  objectionAnnotation {
    ...Annotation
  }
}
    ${MotionStakesFragmentDoc}
${MotionStakeValuesFragmentDoc}
${DomainFragmentDoc}
${VoterRecordFragmentDoc}
${MotionMessageFragmentDoc}
${AnnotationFragmentDoc}`;
export const ColonyActionFragmentDoc = gql`
    fragment ColonyAction on ColonyAction {
  transactionHash: id
  colonyAddress: colonyId
  type
  blockNumber
  initiatorAddress
  initiatorUser {
    ...UserDisplay
  }
  initiatorColony {
    ...ColonyDisplay
  }
  initiatorExtension {
    ...ExtensionDisplayFragment
  }
  initiatorToken {
    ...Token
  }
  initiatorColony {
    ...Colony
  }
  initiatorExtension {
    ...Extension
  }
  initiatorToken {
    ...Token
  }
  recipientAddress
  recipientUser {
    ...UserDisplay
  }
  recipientColony {
    ...ColonyDisplay
  }
  recipientExtension {
    ...ExtensionDisplayFragment
  }
  recipientToken {
    ...Token
  }
  recipientColony {
    ...Colony
  }
  recipientExtension {
    ...Extension
  }
  recipientToken {
    ...Token
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
  roles {
    role_0
    role_1
    role_2
    role_3
    role_5
    role_6
  }
  individualEvents
  isMotion
  motionData {
    ...ColonyMotion
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
  annotation {
    ...Annotation
  }
}
    ${UserDisplayFragmentDoc}
${ColonyDisplayFragmentDoc}
${ExtensionDisplayFragmentFragmentDoc}
${TokenFragmentDoc}
${ColonyFragmentDoc}
${ExtensionFragmentDoc}
${DomainFragmentDoc}
${ColonyMotionFragmentDoc}
${DomainMetadataFragmentDoc}
${ColonyMetadataFragmentDoc}
${AnnotationFragmentDoc}`;
export const WatchListItemFragmentDoc = gql`
    fragment WatchListItem on WatchedColonies {
  colony {
    ...WatchedColony
  }
  createdAt
}
    ${WatchedColonyFragmentDoc}`;
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
  address
  user {
    ...MemberUser
  }
  reputationPercentage
  reputationAmount
}
    ${MemberUserFragmentDoc}`;
export const WatcherFragmentDoc = gql`
    fragment Watcher on Watcher {
  address
  user {
    ...MemberUser
  }
}
    ${MemberUserFragmentDoc}`;
export const CreateAnnotationDocument = gql`
    mutation CreateAnnotation($input: CreateAnnotationInput!) {
  createAnnotation(input: $input) {
    id
  }
}
    `;
export type CreateAnnotationMutationFn = Apollo.MutationFunction<CreateAnnotationMutation, CreateAnnotationMutationVariables>;

/**
 * __useCreateAnnotationMutation__
 *
 * To run a mutation, you first call `useCreateAnnotationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAnnotationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAnnotationMutation, { data, loading, error }] = useCreateAnnotationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAnnotationMutation(baseOptions?: Apollo.MutationHookOptions<CreateAnnotationMutation, CreateAnnotationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAnnotationMutation, CreateAnnotationMutationVariables>(CreateAnnotationDocument, options);
      }
export type CreateAnnotationMutationHookResult = ReturnType<typeof useCreateAnnotationMutation>;
export type CreateAnnotationMutationResult = Apollo.MutationResult<CreateAnnotationMutation>;
export type CreateAnnotationMutationOptions = Apollo.BaseMutationOptions<CreateAnnotationMutation, CreateAnnotationMutationVariables>;
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
export const GetColonyMotionDocument = gql`
    query GetColonyMotion($id: ID!) {
  getColonyMotion(id: $id) {
    ...ColonyMotion
  }
}
    ${ColonyMotionFragmentDoc}`;

/**
 * __useGetColonyMotionQuery__
 *
 * To run a query within a React component, call `useGetColonyMotionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetColonyMotionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetColonyMotionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetColonyMotionQuery(baseOptions: Apollo.QueryHookOptions<GetColonyMotionQuery, GetColonyMotionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetColonyMotionQuery, GetColonyMotionQueryVariables>(GetColonyMotionDocument, options);
      }
export function useGetColonyMotionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetColonyMotionQuery, GetColonyMotionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetColonyMotionQuery, GetColonyMotionQueryVariables>(GetColonyMotionDocument, options);
        }
export type GetColonyMotionQueryHookResult = ReturnType<typeof useGetColonyMotionQuery>;
export type GetColonyMotionLazyQueryHookResult = ReturnType<typeof useGetColonyMotionLazyQuery>;
export type GetColonyMotionQueryResult = Apollo.QueryResult<GetColonyMotionQuery, GetColonyMotionQueryVariables>;
export const GetMotionTransactionHashDocument = gql`
    query GetMotionTransactionHash($motionId: ID!) {
  getColonyActionByMotionId(motionId: $motionId) {
    items {
      id
    }
  }
}
    `;

/**
 * __useGetMotionTransactionHashQuery__
 *
 * To run a query within a React component, call `useGetMotionTransactionHashQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMotionTransactionHashQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMotionTransactionHashQuery({
 *   variables: {
 *      motionId: // value for 'motionId'
 *   },
 * });
 */
export function useGetMotionTransactionHashQuery(baseOptions: Apollo.QueryHookOptions<GetMotionTransactionHashQuery, GetMotionTransactionHashQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMotionTransactionHashQuery, GetMotionTransactionHashQueryVariables>(GetMotionTransactionHashDocument, options);
      }
export function useGetMotionTransactionHashLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMotionTransactionHashQuery, GetMotionTransactionHashQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMotionTransactionHashQuery, GetMotionTransactionHashQueryVariables>(GetMotionTransactionHashDocument, options);
        }
export type GetMotionTransactionHashQueryHookResult = ReturnType<typeof useGetMotionTransactionHashQuery>;
export type GetMotionTransactionHashLazyQueryHookResult = ReturnType<typeof useGetMotionTransactionHashLazyQuery>;
export type GetMotionTransactionHashQueryResult = Apollo.QueryResult<GetMotionTransactionHashQuery, GetMotionTransactionHashQueryVariables>;
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
export const GetDisplayNameByColonyNameDocument = gql`
    query GetDisplayNameByColonyName($name: String!) {
  getColonyByName(name: $name) {
    items {
      metadata {
        displayName
      }
    }
  }
}
    `;

/**
 * __useGetDisplayNameByColonyNameQuery__
 *
 * To run a query within a React component, call `useGetDisplayNameByColonyNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDisplayNameByColonyNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDisplayNameByColonyNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetDisplayNameByColonyNameQuery(baseOptions: Apollo.QueryHookOptions<GetDisplayNameByColonyNameQuery, GetDisplayNameByColonyNameQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDisplayNameByColonyNameQuery, GetDisplayNameByColonyNameQueryVariables>(GetDisplayNameByColonyNameDocument, options);
      }
export function useGetDisplayNameByColonyNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDisplayNameByColonyNameQuery, GetDisplayNameByColonyNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDisplayNameByColonyNameQuery, GetDisplayNameByColonyNameQueryVariables>(GetDisplayNameByColonyNameDocument, options);
        }
export type GetDisplayNameByColonyNameQueryHookResult = ReturnType<typeof useGetDisplayNameByColonyNameQuery>;
export type GetDisplayNameByColonyNameLazyQueryHookResult = ReturnType<typeof useGetDisplayNameByColonyNameLazyQuery>;
export type GetDisplayNameByColonyNameQueryResult = Apollo.QueryResult<GetDisplayNameByColonyNameQuery, GetDisplayNameByColonyNameQueryVariables>;
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