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
  AWSDateTime: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  AWSEmail: any;
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
  AWSURL: any;
};

export type Colony = {
  __typename?: 'Colony';
  balances?: Maybe<ColonyBalances>;
  chainFundsClaim?: Maybe<ColonyChainFundsClaim>;
  colonyNativeTokenId: Scalars['ID'];
  createdAt: Scalars['AWSDateTime'];
  domains?: Maybe<ModelDomainConnection>;
  extensions?: Maybe<ModelColonyExtensionConnection>;
  fundsClaims?: Maybe<ModelColonyFundsClaimConnection>;
  id: Scalars['ID'];
  meta?: Maybe<Metadata>;
  name: Scalars['String'];
  nativeToken: Token;
  profile?: Maybe<Profile>;
  status?: Maybe<ColonyStatus>;
  tokens?: Maybe<ModelColonyTokensConnection>;
  type?: Maybe<ColonyType>;
  updatedAt: Scalars['AWSDateTime'];
  version: Scalars['Int'];
  watchers?: Maybe<ModelWatchedColoniesConnection>;
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
  colony?: Maybe<Colony>;
  contractEventColonyId?: Maybe<Scalars['ID']>;
  contractEventDomainId?: Maybe<Scalars['ID']>;
  contractEventTokenId?: Maybe<Scalars['ID']>;
  contractEventUserId?: Maybe<Scalars['ID']>;
  createdAt: Scalars['AWSDateTime'];
  domain?: Maybe<Domain>;
  encodedArguments?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  meta: Metadata;
  name: Scalars['String'];
  signature: Scalars['String'];
  target: Scalars['String'];
  token?: Maybe<Token>;
  updatedAt: Scalars['AWSDateTime'];
  user?: Maybe<User>;
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
  colonyNativeTokenId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  meta?: InputMaybe<MetadataInput>;
  name: Scalars['String'];
  profile?: InputMaybe<ProfileInput>;
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version: Scalars['Int'];
};

export type CreateColonyTokensInput = {
  colonyID: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
  tokenID: Scalars['ID'];
};

export type CreateContractEventInput = {
  agent: Scalars['String'];
  contractEventColonyId?: InputMaybe<Scalars['ID']>;
  contractEventDomainId?: InputMaybe<Scalars['ID']>;
  contractEventTokenId?: InputMaybe<Scalars['ID']>;
  contractEventUserId?: InputMaybe<Scalars['ID']>;
  encodedArguments?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  meta: MetadataInput;
  name: Scalars['String'];
  signature: Scalars['String'];
  target: Scalars['String'];
};

export type CreateCurrentVersionInput = {
  id?: InputMaybe<Scalars['ID']>;
  key: Scalars['String'];
  version: Scalars['Int'];
};

export type CreateDomainInput = {
  colonyDomainsId?: InputMaybe<Scalars['ID']>;
  color?: InputMaybe<DomainColor>;
  description?: InputMaybe<Scalars['String']>;
  domainParentId?: InputMaybe<Scalars['ID']>;
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  nativeFundingPotId: Scalars['Int'];
  nativeId: Scalars['Int'];
  nativeSkillId: Scalars['Int'];
};

export type CreateTokenInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  decimals: Scalars['Int'];
  id?: InputMaybe<Scalars['ID']>;
  meta?: InputMaybe<MetadataInput>;
  name: Scalars['String'];
  symbol: Scalars['String'];
  type?: InputMaybe<TokenType>;
};

export type CreateUniqueColonyInput = {
  colonyNativeTokenId: Scalars['ID'];
  id: Scalars['ID'];
  meta?: InputMaybe<MetadataInput>;
  name: Scalars['String'];
  profile?: InputMaybe<ProfileInput>;
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version: Scalars['Int'];
};

export type CreateUniqueDomainInput = {
  colonyAddress: Scalars['ID'];
  color?: InputMaybe<DomainColor>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['ID']>;
};

export type CreateUniqueUserInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
  profile?: InputMaybe<ProfileInput>;
};

export type CreateUserInput = {
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  profile?: InputMaybe<ProfileInput>;
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

export type CurrentVersion = {
  __typename?: 'CurrentVersion';
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  key: Scalars['String'];
  updatedAt: Scalars['AWSDateTime'];
  version: Scalars['Int'];
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

export type DeleteColonyTokensInput = {
  id: Scalars['ID'];
};

export type DeleteContractEventInput = {
  id: Scalars['ID'];
};

export type DeleteCurrentVersionInput = {
  id: Scalars['ID'];
};

export type DeleteDomainInput = {
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
  colonyDomainsId?: Maybe<Scalars['ID']>;
  color?: Maybe<DomainColor>;
  createdAt: Scalars['AWSDateTime'];
  description?: Maybe<Scalars['String']>;
  domainParentId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  nativeFundingPotId: Scalars['Int'];
  nativeId: Scalars['Int'];
  nativeSkillId: Scalars['Int'];
  parent?: Maybe<Domain>;
  updatedAt: Scalars['AWSDateTime'];
};

export enum DomainColor {
  Aqua = 'AQUA',
  Black = 'BLACK',
  Blue = 'BLUE',
  Bluegrey = 'BLUEGREY',
  Emeraldgreen = 'EMERALDGREEN',
  Gold = 'GOLD',
  Green = 'GREEN',
  Lightpink = 'LIGHTPINK',
  Magenta = 'MAGENTA',
  Orange = 'ORANGE',
  Periwinkle = 'PERIWINKLE',
  Pink = 'PINK',
  Purple = 'PURPLE',
  Purplegrey = 'PURPLEGREY',
  Red = 'RED',
  Yellow = 'YELLOW'
}

export type DomainInput = {
  id: Scalars['ID'];
};

export type GetUserReputationInput = {
  colonyAddress: Scalars['String'];
  domainId?: InputMaybe<Scalars['Int']>;
  rootHash?: InputMaybe<Scalars['String']>;
  walletAddress: Scalars['String'];
};

export type Metadata = {
  __typename?: 'Metadata';
  blockNumber?: Maybe<Scalars['Int']>;
  chainId?: Maybe<Scalars['Int']>;
  logIndex?: Maybe<Scalars['Int']>;
  network?: Maybe<Network>;
  transactionHash?: Maybe<Scalars['String']>;
};

export type MetadataInput = {
  blockNumber?: InputMaybe<Scalars['Int']>;
  chainId?: InputMaybe<Scalars['Int']>;
  logIndex?: InputMaybe<Scalars['Int']>;
  network?: InputMaybe<Network>;
  transactionHash?: InputMaybe<Scalars['String']>;
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
  colonyDomainsId?: InputMaybe<ModelIdInput>;
  color?: InputMaybe<ModelDomainColorInput>;
  description?: InputMaybe<ModelStringInput>;
  domainParentId?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
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
  colonyDomainsId?: InputMaybe<ModelIdInput>;
  color?: InputMaybe<ModelDomainColorInput>;
  description?: InputMaybe<ModelStringInput>;
  domainParentId?: InputMaybe<ModelIdInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  nativeFundingPotId?: InputMaybe<ModelIntInput>;
  nativeId?: InputMaybe<ModelIntInput>;
  nativeSkillId?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelDomainFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelDomainFilterInput>>>;
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

export type ModelIntKeyConditionInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
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

export type ModelSubscriptionCurrentVersionFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionCurrentVersionFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  key?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionCurrentVersionFilterInput>>>;
  version?: InputMaybe<ModelSubscriptionIntInput>;
};

export type ModelSubscriptionDomainFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionDomainFilterInput>>>;
  color?: InputMaybe<ModelSubscriptionStringInput>;
  description?: InputMaybe<ModelSubscriptionStringInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  nativeFundingPotId?: InputMaybe<ModelSubscriptionIntInput>;
  nativeId?: InputMaybe<ModelSubscriptionIntInput>;
  nativeSkillId?: InputMaybe<ModelSubscriptionIntInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionDomainFilterInput>>>;
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
  createdAt?: InputMaybe<ModelSubscriptionStringInput>;
  decimals?: InputMaybe<ModelSubscriptionIntInput>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionTokenFilterInput>>>;
  symbol?: InputMaybe<ModelSubscriptionStringInput>;
  type?: InputMaybe<ModelSubscriptionStringInput>;
};

export type ModelSubscriptionUserFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFilterInput>>>;
  id?: InputMaybe<ModelSubscriptionIdInput>;
  name?: InputMaybe<ModelSubscriptionStringInput>;
  or?: InputMaybe<Array<InputMaybe<ModelSubscriptionUserFilterInput>>>;
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
  createdAt?: InputMaybe<ModelStringInput>;
  decimals?: InputMaybe<ModelIntInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelTokenConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTokenConditionInput>>>;
  symbol?: InputMaybe<ModelStringInput>;
  type?: InputMaybe<ModelTokenTypeInput>;
};

export type ModelTokenConnection = {
  __typename?: 'ModelTokenConnection';
  items: Array<Maybe<Token>>;
  nextToken?: Maybe<Scalars['String']>;
};

export type ModelTokenFilterInput = {
  and?: InputMaybe<Array<InputMaybe<ModelTokenFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  decimals?: InputMaybe<ModelIntInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelTokenFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTokenFilterInput>>>;
  symbol?: InputMaybe<ModelStringInput>;
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

export type Mutation = {
  __typename?: 'Mutation';
  createColony?: Maybe<Colony>;
  createColonyExtension?: Maybe<ColonyExtension>;
  createColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  createColonyTokens?: Maybe<ColonyTokens>;
  createContractEvent?: Maybe<ContractEvent>;
  createCurrentVersion?: Maybe<CurrentVersion>;
  createDomain?: Maybe<Domain>;
  createToken?: Maybe<Token>;
  createUniqueColony?: Maybe<Colony>;
  createUniqueDomain?: Maybe<Domain>;
  createUniqueUser?: Maybe<User>;
  createUser?: Maybe<User>;
  createUserTokens?: Maybe<UserTokens>;
  createWatchedColonies?: Maybe<WatchedColonies>;
  deleteColony?: Maybe<Colony>;
  deleteColonyExtension?: Maybe<ColonyExtension>;
  deleteColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  deleteColonyTokens?: Maybe<ColonyTokens>;
  deleteContractEvent?: Maybe<ContractEvent>;
  deleteCurrentVersion?: Maybe<CurrentVersion>;
  deleteDomain?: Maybe<Domain>;
  deleteToken?: Maybe<Token>;
  deleteUser?: Maybe<User>;
  deleteUserTokens?: Maybe<UserTokens>;
  deleteWatchedColonies?: Maybe<WatchedColonies>;
  setCurrentVersion?: Maybe<Scalars['Boolean']>;
  updateColony?: Maybe<Colony>;
  updateColonyExtension?: Maybe<ColonyExtension>;
  updateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  updateColonyTokens?: Maybe<ColonyTokens>;
  updateContractEvent?: Maybe<ContractEvent>;
  updateCurrentVersion?: Maybe<CurrentVersion>;
  updateDomain?: Maybe<Domain>;
  updateExtensionByColonyAndHash?: Maybe<ColonyExtension>;
  updateToken?: Maybe<Token>;
  updateUser?: Maybe<User>;
  updateUserTokens?: Maybe<UserTokens>;
  updateWatchedColonies?: Maybe<WatchedColonies>;
};


export type MutationCreateColonyArgs = {
  condition?: InputMaybe<ModelColonyConditionInput>;
  input: CreateColonyInput;
};


export type MutationCreateColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: CreateColonyExtensionInput;
};


export type MutationCreateColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: CreateColonyFundsClaimInput;
};


export type MutationCreateColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: CreateColonyTokensInput;
};


export type MutationCreateContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: CreateContractEventInput;
};


export type MutationCreateCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: CreateCurrentVersionInput;
};


export type MutationCreateDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: CreateDomainInput;
};


export type MutationCreateTokenArgs = {
  condition?: InputMaybe<ModelTokenConditionInput>;
  input: CreateTokenInput;
};


export type MutationCreateUniqueColonyArgs = {
  input?: InputMaybe<CreateUniqueColonyInput>;
};


export type MutationCreateUniqueDomainArgs = {
  input?: InputMaybe<CreateUniqueDomainInput>;
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


export type MutationDeleteColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: DeleteColonyExtensionInput;
};


export type MutationDeleteColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: DeleteColonyFundsClaimInput;
};


export type MutationDeleteColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: DeleteColonyTokensInput;
};


export type MutationDeleteContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: DeleteContractEventInput;
};


export type MutationDeleteCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: DeleteCurrentVersionInput;
};


export type MutationDeleteDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: DeleteDomainInput;
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


export type MutationUpdateColonyExtensionArgs = {
  condition?: InputMaybe<ModelColonyExtensionConditionInput>;
  input: UpdateColonyExtensionInput;
};


export type MutationUpdateColonyFundsClaimArgs = {
  condition?: InputMaybe<ModelColonyFundsClaimConditionInput>;
  input: UpdateColonyFundsClaimInput;
};


export type MutationUpdateColonyTokensArgs = {
  condition?: InputMaybe<ModelColonyTokensConditionInput>;
  input: UpdateColonyTokensInput;
};


export type MutationUpdateContractEventArgs = {
  condition?: InputMaybe<ModelContractEventConditionInput>;
  input: UpdateContractEventInput;
};


export type MutationUpdateCurrentVersionArgs = {
  condition?: InputMaybe<ModelCurrentVersionConditionInput>;
  input: UpdateCurrentVersionInput;
};


export type MutationUpdateDomainArgs = {
  condition?: InputMaybe<ModelDomainConditionInput>;
  input: UpdateDomainInput;
};


export type MutationUpdateExtensionByColonyAndHashArgs = {
  input?: InputMaybe<UpdateExtensionByColonyAndHashInput>;
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

export type Profile = {
  __typename?: 'Profile';
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['AWSEmail']>;
  location?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['AWSURL']>;
};

export type ProfileInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['AWSEmail']>;
  location?: InputMaybe<Scalars['String']>;
  thumbnail?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['AWSURL']>;
};

export type Query = {
  __typename?: 'Query';
  getColony?: Maybe<Colony>;
  getColonyByAddress?: Maybe<ModelColonyConnection>;
  getColonyByName?: Maybe<ModelColonyConnection>;
  getColonyByType?: Maybe<ModelColonyConnection>;
  getColonyExtension?: Maybe<ColonyExtension>;
  getColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  getColonyTokens?: Maybe<ColonyTokens>;
  getContractEvent?: Maybe<ContractEvent>;
  getCurrentVersion?: Maybe<CurrentVersion>;
  getCurrentVersionByKey?: Maybe<ModelCurrentVersionConnection>;
  getDomain?: Maybe<Domain>;
  getExtensionByColonyAndHash?: Maybe<ModelColonyExtensionConnection>;
  getToken?: Maybe<Token>;
  getTokenByAddress?: Maybe<ModelTokenConnection>;
  getTokenFromEverywhere?: Maybe<TokenFromEverywhereReturn>;
  getTokensByType?: Maybe<ModelTokenConnection>;
  getUser?: Maybe<User>;
  getUserByAddress?: Maybe<ModelUserConnection>;
  getUserByName?: Maybe<ModelUserConnection>;
  getUserReputation?: Maybe<Scalars['String']>;
  getUserTokens?: Maybe<UserTokens>;
  getWatchedColonies?: Maybe<WatchedColonies>;
  listColonies?: Maybe<ModelColonyConnection>;
  listColonyExtensions?: Maybe<ModelColonyExtensionConnection>;
  listColonyFundsClaims?: Maybe<ModelColonyFundsClaimConnection>;
  listColonyTokens?: Maybe<ModelColonyTokensConnection>;
  listContractEvents?: Maybe<ModelContractEventConnection>;
  listCurrentVersions?: Maybe<ModelCurrentVersionConnection>;
  listDomains?: Maybe<ModelDomainConnection>;
  listTokens?: Maybe<ModelTokenConnection>;
  listUserTokens?: Maybe<ModelUserTokensConnection>;
  listUsers?: Maybe<ModelUserConnection>;
  listWatchedColonies?: Maybe<ModelWatchedColoniesConnection>;
};


export type QueryGetColonyArgs = {
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


export type QueryGetColonyTokensArgs = {
  id: Scalars['ID'];
};


export type QueryGetContractEventArgs = {
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


export type QueryGetExtensionByColonyAndHashArgs = {
  colonyId: Scalars['ID'];
  filter?: InputMaybe<ModelColonyExtensionFilterInput>;
  hash?: InputMaybe<ModelStringKeyConditionInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sortDirection?: InputMaybe<ModelSortDirection>;
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


export type QueryGetUserTokensArgs = {
  id: Scalars['ID'];
};


export type QueryGetWatchedColoniesArgs = {
  id: Scalars['ID'];
};


export type QueryListColoniesArgs = {
  filter?: InputMaybe<ModelColonyFilterInput>;
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


export type QueryListCurrentVersionsArgs = {
  filter?: InputMaybe<ModelCurrentVersionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
};


export type QueryListDomainsArgs = {
  filter?: InputMaybe<ModelDomainFilterInput>;
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

export type Subscription = {
  __typename?: 'Subscription';
  onCreateColony?: Maybe<Colony>;
  onCreateColonyExtension?: Maybe<ColonyExtension>;
  onCreateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onCreateColonyTokens?: Maybe<ColonyTokens>;
  onCreateContractEvent?: Maybe<ContractEvent>;
  onCreateCurrentVersion?: Maybe<CurrentVersion>;
  onCreateDomain?: Maybe<Domain>;
  onCreateToken?: Maybe<Token>;
  onCreateUser?: Maybe<User>;
  onCreateUserTokens?: Maybe<UserTokens>;
  onCreateWatchedColonies?: Maybe<WatchedColonies>;
  onDeleteColony?: Maybe<Colony>;
  onDeleteColonyExtension?: Maybe<ColonyExtension>;
  onDeleteColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onDeleteColonyTokens?: Maybe<ColonyTokens>;
  onDeleteContractEvent?: Maybe<ContractEvent>;
  onDeleteCurrentVersion?: Maybe<CurrentVersion>;
  onDeleteDomain?: Maybe<Domain>;
  onDeleteToken?: Maybe<Token>;
  onDeleteUser?: Maybe<User>;
  onDeleteUserTokens?: Maybe<UserTokens>;
  onDeleteWatchedColonies?: Maybe<WatchedColonies>;
  onUpdateColony?: Maybe<Colony>;
  onUpdateColonyExtension?: Maybe<ColonyExtension>;
  onUpdateColonyFundsClaim?: Maybe<ColonyFundsClaim>;
  onUpdateColonyTokens?: Maybe<ColonyTokens>;
  onUpdateContractEvent?: Maybe<ContractEvent>;
  onUpdateCurrentVersion?: Maybe<CurrentVersion>;
  onUpdateDomain?: Maybe<Domain>;
  onUpdateToken?: Maybe<Token>;
  onUpdateUser?: Maybe<User>;
  onUpdateUserTokens?: Maybe<UserTokens>;
  onUpdateWatchedColonies?: Maybe<WatchedColonies>;
};


export type SubscriptionOnCreateColonyArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFilterInput>;
};


export type SubscriptionOnCreateColonyExtensionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyExtensionFilterInput>;
};


export type SubscriptionOnCreateColonyFundsClaimArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>;
};


export type SubscriptionOnCreateColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};


export type SubscriptionOnCreateContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
};


export type SubscriptionOnCreateCurrentVersionArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentVersionFilterInput>;
};


export type SubscriptionOnCreateDomainArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainFilterInput>;
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


export type SubscriptionOnDeleteColonyExtensionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyExtensionFilterInput>;
};


export type SubscriptionOnDeleteColonyFundsClaimArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>;
};


export type SubscriptionOnDeleteColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};


export type SubscriptionOnDeleteContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
};


export type SubscriptionOnDeleteCurrentVersionArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentVersionFilterInput>;
};


export type SubscriptionOnDeleteDomainArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainFilterInput>;
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


export type SubscriptionOnUpdateColonyExtensionArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyExtensionFilterInput>;
};


export type SubscriptionOnUpdateColonyFundsClaimArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyFundsClaimFilterInput>;
};


export type SubscriptionOnUpdateColonyTokensArgs = {
  filter?: InputMaybe<ModelSubscriptionColonyTokensFilterInput>;
};


export type SubscriptionOnUpdateContractEventArgs = {
  filter?: InputMaybe<ModelSubscriptionContractEventFilterInput>;
};


export type SubscriptionOnUpdateCurrentVersionArgs = {
  filter?: InputMaybe<ModelSubscriptionCurrentVersionFilterInput>;
};


export type SubscriptionOnUpdateDomainArgs = {
  filter?: InputMaybe<ModelSubscriptionDomainFilterInput>;
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
  colonies?: Maybe<ModelColonyTokensConnection>;
  createdAt: Scalars['AWSDateTime'];
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  meta?: Maybe<Metadata>;
  name: Scalars['String'];
  symbol: Scalars['String'];
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

export type UpdateColonyExtensionInput = {
  colonyId?: InputMaybe<Scalars['ID']>;
  hash?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  installedAt?: InputMaybe<Scalars['AWSTimestamp']>;
  installedBy?: InputMaybe<Scalars['String']>;
  isDeleted?: InputMaybe<Scalars['Boolean']>;
  isDeprecated?: InputMaybe<Scalars['Boolean']>;
  isInitialized?: InputMaybe<Scalars['Boolean']>;
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
  colonyNativeTokenId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  meta?: InputMaybe<MetadataInput>;
  name?: InputMaybe<Scalars['String']>;
  profile?: InputMaybe<ProfileInput>;
  status?: InputMaybe<ColonyStatusInput>;
  type?: InputMaybe<ColonyType>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateColonyTokensInput = {
  colonyID?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  tokenID?: InputMaybe<Scalars['ID']>;
};

export type UpdateContractEventInput = {
  agent?: InputMaybe<Scalars['String']>;
  contractEventColonyId?: InputMaybe<Scalars['ID']>;
  contractEventDomainId?: InputMaybe<Scalars['ID']>;
  contractEventTokenId?: InputMaybe<Scalars['ID']>;
  contractEventUserId?: InputMaybe<Scalars['ID']>;
  encodedArguments?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  meta?: InputMaybe<MetadataInput>;
  name?: InputMaybe<Scalars['String']>;
  signature?: InputMaybe<Scalars['String']>;
  target?: InputMaybe<Scalars['String']>;
};

export type UpdateCurrentVersionInput = {
  id: Scalars['ID'];
  key?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateDomainInput = {
  colonyDomainsId?: InputMaybe<Scalars['ID']>;
  color?: InputMaybe<DomainColor>;
  description?: InputMaybe<Scalars['String']>;
  domainParentId?: InputMaybe<Scalars['ID']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  nativeFundingPotId?: InputMaybe<Scalars['Int']>;
  nativeId?: InputMaybe<Scalars['Int']>;
  nativeSkillId?: InputMaybe<Scalars['Int']>;
};

export type UpdateExtensionByColonyAndHashInput = {
  colonyId: Scalars['ID'];
  hash: Scalars['String'];
  isDeleted?: InputMaybe<Scalars['Boolean']>;
  isDeprecated?: InputMaybe<Scalars['Boolean']>;
  isInitialized?: InputMaybe<Scalars['Boolean']>;
  version?: InputMaybe<Scalars['Int']>;
};

export type UpdateTokenInput = {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  decimals?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  meta?: InputMaybe<MetadataInput>;
  name?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<TokenType>;
};

export type UpdateUserInput = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  profile?: InputMaybe<ProfileInput>;
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

export type ColonyFragment = { __typename?: 'Colony', name: string, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, tokenAddress: string }, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: any | null, location?: string | null, thumbnail?: string | null, website?: any | null } | null, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, meta?: { __typename?: 'Metadata', chainId?: number | null, network?: Network | null } | null, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, tokenAddress: string } } | null> } | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', color?: DomainColor | null, description?: string | null, id: string, name?: string | null, nativeId: number, parentId?: string | null } | null> } | null, watchers?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', user: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: any | null, location?: string | null, website?: any | null, thumbnail?: string | null } | null } } | null> } | null };

export type WatcherFragment = { __typename?: 'WatchedColonies', user: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: any | null, location?: string | null, website?: any | null, thumbnail?: string | null } | null } };

export type ExtensionFragment = { __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number };

export type TokenFragment = { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, tokenAddress: string };

export type UserFragment = { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: any | null, location?: string | null, thumbnail?: string | null, website?: any | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', createdAt: any, colony: { __typename?: 'Colony', name: string, colonyAddress: string, profile?: { __typename?: 'Profile', displayName?: string | null, thumbnail?: string | null } | null, meta?: { __typename?: 'Metadata', chainId?: number | null, network?: Network | null } | null } } | null> } | null };

export type CreateUniqueColonyMutationVariables = Exact<{
  input: CreateUniqueColonyInput;
}>;


export type CreateUniqueColonyMutation = { __typename?: 'Mutation', createUniqueColony?: { __typename?: 'Colony', id: string } | null };

export type CreateWatchedColoniesMutationVariables = Exact<{
  input: CreateWatchedColoniesInput;
}>;


export type CreateWatchedColoniesMutation = { __typename?: 'Mutation', createWatchedColonies?: { __typename?: 'WatchedColonies', id: string } | null };

export type CreateUniqueDomainMutationVariables = Exact<{
  input: CreateUniqueDomainInput;
}>;


export type CreateUniqueDomainMutation = { __typename?: 'Mutation', createUniqueDomain?: { __typename?: 'Domain', id: string } | null };

export type CreateColonyTokensMutationVariables = Exact<{
  input: CreateColonyTokensInput;
}>;


export type CreateColonyTokensMutation = { __typename?: 'Mutation', createColonyTokens?: { __typename?: 'ColonyTokens', id: string } | null };

export type CreateUserTokensMutationVariables = Exact<{
  input: CreateUserTokensInput;
}>;


export type CreateUserTokensMutation = { __typename?: 'Mutation', createUserTokens?: { __typename?: 'UserTokens', id: string } | null };

export type GetFullColonyByNameQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetFullColonyByNameQuery = { __typename?: 'Query', getColonyByName?: { __typename?: 'ModelColonyConnection', items: Array<{ __typename?: 'Colony', name: string, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, tokenAddress: string }, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: any | null, location?: string | null, thumbnail?: string | null, website?: any | null } | null, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, meta?: { __typename?: 'Metadata', chainId?: number | null, network?: Network | null } | null, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, tokenAddress: string } } | null> } | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', color?: DomainColor | null, description?: string | null, id: string, name?: string | null, nativeId: number, parentId?: string | null } | null> } | null, watchers?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', user: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: any | null, location?: string | null, website?: any | null, thumbnail?: string | null } | null } } | null> } | null } | null> } | null };

export type GetMetacolonyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMetacolonyQuery = { __typename?: 'Query', getColonyByType?: { __typename?: 'ModelColonyConnection', items: Array<{ __typename?: 'Colony', name: string, colonyAddress: string, nativeToken: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, tokenAddress: string }, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: any | null, location?: string | null, thumbnail?: string | null, website?: any | null } | null, status?: { __typename?: 'ColonyStatus', recovery?: boolean | null, nativeToken?: { __typename?: 'NativeTokenStatus', mintable?: boolean | null, unlockable?: boolean | null, unlocked?: boolean | null } | null } | null, meta?: { __typename?: 'Metadata', chainId?: number | null, network?: Network | null } | null, tokens?: { __typename?: 'ModelColonyTokensConnection', items: Array<{ __typename?: 'ColonyTokens', token: { __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, tokenAddress: string } } | null> } | null, domains?: { __typename?: 'ModelDomainConnection', items: Array<{ __typename?: 'Domain', color?: DomainColor | null, description?: string | null, id: string, name?: string | null, nativeId: number, parentId?: string | null } | null> } | null, watchers?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', user: { __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: any | null, location?: string | null, website?: any | null, thumbnail?: string | null } | null } } | null> } | null } | null> } | null };

export type GetColonyExtensionsQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
}>;


export type GetColonyExtensionsQuery = { __typename?: 'Query', getColony?: { __typename?: 'Colony', extensions?: { __typename?: 'ModelColonyExtensionConnection', items: Array<{ __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number } | null> } | null } | null };

export type GetColonyExtensionQueryVariables = Exact<{
  colonyAddress: Scalars['ID'];
  extensionHash: Scalars['String'];
}>;


export type GetColonyExtensionQuery = { __typename?: 'Query', getExtensionByColonyAndHash?: { __typename?: 'ModelColonyExtensionConnection', items: Array<{ __typename?: 'ColonyExtension', hash: string, installedBy: string, installedAt: any, isDeprecated: boolean, isDeleted: boolean, isInitialized: boolean, address: string, colonyAddress: string, currentVersion: number } | null> } | null };

export type GetTokenByAddressQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type GetTokenByAddressQuery = { __typename?: 'Query', getTokenByAddress?: { __typename?: 'ModelTokenConnection', items: Array<{ __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, tokenAddress: string } | null> } | null };

export type GetTokenFromEverywhereQueryVariables = Exact<{
  input: TokenFromEverywhereArguments;
}>;


export type GetTokenFromEverywhereQuery = { __typename?: 'Query', getTokenFromEverywhere?: { __typename?: 'TokenFromEverywhereReturn', items?: Array<{ __typename?: 'Token', decimals: number, name: string, symbol: string, type?: TokenType | null, tokenAddress: string } | null> | null } | null };

export type GetCurrentUserQueryVariables = Exact<{
  address: Scalars['ID'];
}>;


export type GetCurrentUserQuery = { __typename?: 'Query', getUserByAddress?: { __typename?: 'ModelUserConnection', items: Array<{ __typename?: 'User', name: string, walletAddress: string, profile?: { __typename?: 'Profile', avatar?: string | null, bio?: string | null, displayName?: string | null, email?: any | null, location?: string | null, thumbnail?: string | null, website?: any | null } | null, watchlist?: { __typename?: 'ModelWatchedColoniesConnection', items: Array<{ __typename?: 'WatchedColonies', createdAt: any, colony: { __typename?: 'Colony', name: string, colonyAddress: string, profile?: { __typename?: 'Profile', displayName?: string | null, thumbnail?: string | null } | null, meta?: { __typename?: 'Metadata', chainId?: number | null, network?: Network | null } | null } } | null> } | null } | null> } | null };

export type GetUserReputationQueryVariables = Exact<{
  input: GetUserReputationInput;
}>;


export type GetUserReputationQuery = { __typename?: 'Query', getUserReputation?: string | null };

export type GetCurrentExtensionsVersionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentExtensionsVersionsQuery = { __typename?: 'Query', listCurrentVersions?: { __typename?: 'ModelCurrentVersionConnection', items: Array<{ __typename?: 'CurrentVersion', version: number, extensionHash: string } | null> } | null };

export type GetCurrentExtensionVersionQueryVariables = Exact<{
  extensionHash: Scalars['String'];
}>;


export type GetCurrentExtensionVersionQuery = { __typename?: 'Query', getCurrentVersionByKey?: { __typename?: 'ModelCurrentVersionConnection', items: Array<{ __typename?: 'CurrentVersion', version: number, extensionHash: string } | null> } | null };

export const TokenFragmentDoc = gql`
    fragment Token on Token {
  decimals
  tokenAddress: id
  name
  symbol
  type
}
    `;
export const WatcherFragmentDoc = gql`
    fragment Watcher on WatchedColonies {
  user {
    walletAddress: id
    name
    profile {
      avatar
      bio
      displayName
      email
      location
      website
      thumbnail
    }
  }
}
    `;
export const ColonyFragmentDoc = gql`
    fragment Colony on Colony {
  colonyAddress: id
  name
  nativeToken {
    ...Token
  }
  profile {
    avatar
    bio
    displayName
    email
    location
    thumbnail
    website
  }
  status {
    recovery
    nativeToken {
      mintable
      unlockable
      unlocked
    }
  }
  meta {
    chainId
    network
  }
  tokens {
    items {
      token {
        ...Token
      }
    }
  }
  domains {
    items {
      color
      description
      id
      name
      nativeId
      parentId: domainParentId
    }
  }
  watchers {
    items {
      ...Watcher
    }
  }
}
    ${TokenFragmentDoc}
${WatcherFragmentDoc}`;
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
}
    `;
export const UserFragmentDoc = gql`
    fragment User on User {
  profile {
    avatar
    bio
    displayName
    email
    location
    thumbnail
    website
  }
  walletAddress: id
  name
  watchlist {
    items {
      colony {
        colonyAddress: id
        name
        profile {
          displayName
          thumbnail
        }
        meta {
          chainId
          network
        }
      }
      createdAt
    }
  }
}
    `;
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
export const CreateUniqueDomainDocument = gql`
    mutation CreateUniqueDomain($input: CreateUniqueDomainInput!) {
  createUniqueDomain(input: $input) {
    id
  }
}
    `;
export type CreateUniqueDomainMutationFn = Apollo.MutationFunction<CreateUniqueDomainMutation, CreateUniqueDomainMutationVariables>;

/**
 * __useCreateUniqueDomainMutation__
 *
 * To run a mutation, you first call `useCreateUniqueDomainMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUniqueDomainMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUniqueDomainMutation, { data, loading, error }] = useCreateUniqueDomainMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUniqueDomainMutation(baseOptions?: Apollo.MutationHookOptions<CreateUniqueDomainMutation, CreateUniqueDomainMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUniqueDomainMutation, CreateUniqueDomainMutationVariables>(CreateUniqueDomainDocument, options);
      }
export type CreateUniqueDomainMutationHookResult = ReturnType<typeof useCreateUniqueDomainMutation>;
export type CreateUniqueDomainMutationResult = Apollo.MutationResult<CreateUniqueDomainMutation>;
export type CreateUniqueDomainMutationOptions = Apollo.BaseMutationOptions<CreateUniqueDomainMutation, CreateUniqueDomainMutationVariables>;
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
export const GetCurrentUserDocument = gql`
    query GetCurrentUser($address: ID!) {
  getUserByAddress(id: $address) {
    items {
      ...User
    }
  }
}
    ${UserFragmentDoc}`;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
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