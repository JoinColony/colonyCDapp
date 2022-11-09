/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ModelColonyConnection = {
  __typename: "ModelColonyConnection",
  items:  Array<Colony | null >,
  nextToken?: string | null,
};

export type Colony = {
  __typename: "Colony",
  id: string,
  name: string,
  nativeToken: Token,
  tokens?: ModelColonyTokensConnection | null,
  profile?: Profile | null,
  status?: ColonyStatus | null,
  domains?: ModelDomainConnection | null,
  watchers?: ModelWatchedColoniesConnection | null,
  fundsClaims?: ModelColonyFundsClaimConnection | null,
  chainFundsClaim?: ColonyChainFundsClaim | null,
  type?: ColonyType | null,
  balances?: ColonyBalances | null,
  meta?: Metadata | null,
  createdAt: string,
  updatedAt: string,
  colonyNativeTokenId: string,
};

export type Token = {
  __typename: "Token",
  id: string,
  name: string,
  symbol: string,
  decimals: number,
  type?: TokenType | null,
  colonies?: ModelColonyTokensConnection | null,
  users?: ModelUserTokensConnection | null,
  meta?: Metadata | null,
  createdAt: string,
  updatedAt: string,
};

export enum TokenType {
  COLONY = "COLONY",
  ERC20 = "ERC20",
  CHAIN_NATIVE = "CHAIN_NATIVE",
}


export type ModelColonyTokensConnection = {
  __typename: "ModelColonyTokensConnection",
  items:  Array<ColonyTokens | null >,
  nextToken?: string | null,
};

export type ColonyTokens = {
  __typename: "ColonyTokens",
  id: string,
  tokenID: string,
  colonyID: string,
  token: Token,
  colony: Colony,
  createdAt: string,
  updatedAt: string,
};

export type ModelUserTokensConnection = {
  __typename: "ModelUserTokensConnection",
  items:  Array<UserTokens | null >,
  nextToken?: string | null,
};

export type UserTokens = {
  __typename: "UserTokens",
  id: string,
  tokenID: string,
  userID: string,
  token: Token,
  user: User,
  createdAt: string,
  updatedAt: string,
};

export type User = {
  __typename: "User",
  id: string,
  name: string,
  tokens?: ModelUserTokensConnection | null,
  profile?: Profile | null,
  watchlist?: ModelWatchedColoniesConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type Profile = {
  __typename: "Profile",
  avatar?: string | null,
  thumbnail?: string | null,
  displayName?: string | null,
  bio?: string | null,
  location?: string | null,
  website?: string | null,
  email?: string | null,
};

export type ModelWatchedColoniesConnection = {
  __typename: "ModelWatchedColoniesConnection",
  items:  Array<WatchedColonies | null >,
  nextToken?: string | null,
};

export type WatchedColonies = {
  __typename: "WatchedColonies",
  id: string,
  colonyID: string,
  userID: string,
  colony: Colony,
  user: User,
  createdAt: string,
  updatedAt: string,
};

export type Metadata = {
  __typename: "Metadata",
  network?: Network | null,
  chainId?: number | null,
  transactionHash?: string | null,
  logIndex?: number | null,
  blockNumber?: number | null,
};

export enum Network {
  GANACHE = "GANACHE",
  MAINNET = "MAINNET",
  GOERLI = "GOERLI",
  GNOSIS = "GNOSIS",
  GNOSISFORK = "GNOSISFORK",
}


export type ColonyStatus = {
  __typename: "ColonyStatus",
  nativeToken?: NativeTokenStatus | null,
  recovery?: boolean | null,
};

export type NativeTokenStatus = {
  __typename: "NativeTokenStatus",
  unlocked?: boolean | null,
  mintable?: boolean | null,
  unlockable?: boolean | null,
};

export type ModelDomainConnection = {
  __typename: "ModelDomainConnection",
  items:  Array<Domain | null >,
  nextToken?: string | null,
};

export type Domain = {
  __typename: "Domain",
  id: string,
  nativeId: number,
  nativeFundingPotId: number,
  nativeSkillId: number,
  name?: string | null,
  description?: string | null,
  color?: DomainColor | null,
  parent?: Domain | null,
  createdAt: string,
  updatedAt: string,
  colonyDomainsId?: string | null,
  domainParentId?: string | null,
};

export enum DomainColor {
  LIGHTPINK = "LIGHTPINK",
  PINK = "PINK",
  BLACK = "BLACK",
  EMERALDGREEN = "EMERALDGREEN",
  BLUE = "BLUE",
  YELLOW = "YELLOW",
  RED = "RED",
  GREEN = "GREEN",
  PERIWINKLE = "PERIWINKLE",
  GOLD = "GOLD",
  AQUA = "AQUA",
  BLUEGREY = "BLUEGREY",
  PURPLE = "PURPLE",
  ORANGE = "ORANGE",
  MAGENTA = "MAGENTA",
  PURPLEGREY = "PURPLEGREY",
}


export type ModelColonyFundsClaimConnection = {
  __typename: "ModelColonyFundsClaimConnection",
  items:  Array<ColonyFundsClaim | null >,
  nextToken?: string | null,
};

export type ColonyFundsClaim = {
  __typename: "ColonyFundsClaim",
  id: string,
  token: Token,
  createdAtBlock: number,
  createdAt: string,
  amount: string,
  updatedAt: string,
  colonyFundsClaimsId?: string | null,
  colonyFundsClaimTokenId: string,
};

export type ColonyChainFundsClaim = {
  __typename: "ColonyChainFundsClaim",
  id: string,
  createdAtBlock: number,
  createdAt: string,
  updatedAt: string,
  amount: string,
};

export enum ColonyType {
  COLONY = "COLONY",
  METACOLONY = "METACOLONY",
}


export type ColonyBalances = {
  __typename: "ColonyBalances",
  items?:  Array<ColonyBalance | null > | null,
};

export type ColonyBalance = {
  __typename: "ColonyBalance",
  id: string,
  balance: string,
  domain: Domain,
  token: Token,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type CreateUniqueUserInput = {
  id: string,
  name: string,
  profile?: ProfileInput | null,
};

export type ProfileInput = {
  avatar?: string | null,
  thumbnail?: string | null,
  displayName?: string | null,
  bio?: string | null,
  location?: string | null,
  website?: string | null,
  email?: string | null,
};

export type CreateUniqueColonyInput = {
  id: string,
  name: string,
  colonyNativeTokenId: string,
  profile?: ProfileInput | null,
  type?: ColonyType | null,
  status?: ColonyStatusInput | null,
  meta?: MetadataInput | null,
};

export type ColonyStatusInput = {
  nativeToken?: NativeTokenStatusInput | null,
  recovery?: boolean | null,
};

export type NativeTokenStatusInput = {
  unlocked?: boolean | null,
  mintable?: boolean | null,
  unlockable?: boolean | null,
};

export type MetadataInput = {
  network?: Network | null,
  chainId?: number | null,
  transactionHash?: string | null,
  logIndex?: number | null,
  blockNumber?: number | null,
};

export type CreateUniqueDomainInput = {
  colonyAddress: string,
  parentId?: string | null,
  name?: string | null,
  description?: string | null,
  color?: DomainColor | null,
};

export type CreateTokenInput = {
  id?: string | null,
  name: string,
  symbol: string,
  decimals: number,
  type?: TokenType | null,
  meta?: MetadataInput | null,
  createdAt?: string | null,
};

export type ModelTokenConditionInput = {
  name?: ModelStringInput | null,
  symbol?: ModelStringInput | null,
  decimals?: ModelIntInput | null,
  type?: ModelTokenTypeInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelTokenConditionInput | null > | null,
  or?: Array< ModelTokenConditionInput | null > | null,
  not?: ModelTokenConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelTokenTypeInput = {
  eq?: TokenType | null,
  ne?: TokenType | null,
};

export type UpdateTokenInput = {
  id: string,
  name?: string | null,
  symbol?: string | null,
  decimals?: number | null,
  type?: TokenType | null,
  meta?: MetadataInput | null,
  createdAt?: string | null,
};

export type DeleteTokenInput = {
  id: string,
};

export type CreateColonyInput = {
  id?: string | null,
  name: string,
  profile?: ProfileInput | null,
  status?: ColonyStatusInput | null,
  chainFundsClaim?: ColonyChainFundsClaimInput | null,
  type?: ColonyType | null,
  balances?: ColonyBalancesInput | null,
  meta?: MetadataInput | null,
  colonyNativeTokenId: string,
};

export type ColonyChainFundsClaimInput = {
  id?: string | null,
  createdAtBlock: number,
  createdAt?: string | null,
  updatedAt?: string | null,
  amount: string,
};

export type ColonyBalancesInput = {
  items?: Array< ColonyBalanceInput | null > | null,
};

export type ColonyBalanceInput = {
  id?: string | null,
  balance: string,
  domain: DomainInput,
  token: TokenInput,
};

export type DomainInput = {
  id: string,
};

export type TokenInput = {
  id: string,
};

export type ModelColonyConditionInput = {
  name?: ModelStringInput | null,
  type?: ModelColonyTypeInput | null,
  and?: Array< ModelColonyConditionInput | null > | null,
  or?: Array< ModelColonyConditionInput | null > | null,
  not?: ModelColonyConditionInput | null,
  colonyNativeTokenId?: ModelIDInput | null,
};

export type ModelColonyTypeInput = {
  eq?: ColonyType | null,
  ne?: ColonyType | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateColonyInput = {
  id: string,
  name?: string | null,
  profile?: ProfileInput | null,
  status?: ColonyStatusInput | null,
  chainFundsClaim?: ColonyChainFundsClaimInput | null,
  type?: ColonyType | null,
  balances?: ColonyBalancesInput | null,
  meta?: MetadataInput | null,
  colonyNativeTokenId: string,
};

export type DeleteColonyInput = {
  id: string,
};

export type CreateUserInput = {
  id?: string | null,
  name: string,
  profile?: ProfileInput | null,
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
  profile?: ProfileInput | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateDomainInput = {
  id?: string | null,
  nativeId: number,
  nativeFundingPotId: number,
  nativeSkillId: number,
  name?: string | null,
  description?: string | null,
  color?: DomainColor | null,
  colonyDomainsId?: string | null,
  domainParentId?: string | null,
};

export type ModelDomainConditionInput = {
  nativeId?: ModelIntInput | null,
  nativeFundingPotId?: ModelIntInput | null,
  nativeSkillId?: ModelIntInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  color?: ModelDomainColorInput | null,
  and?: Array< ModelDomainConditionInput | null > | null,
  or?: Array< ModelDomainConditionInput | null > | null,
  not?: ModelDomainConditionInput | null,
  colonyDomainsId?: ModelIDInput | null,
  domainParentId?: ModelIDInput | null,
};

export type ModelDomainColorInput = {
  eq?: DomainColor | null,
  ne?: DomainColor | null,
};

export type UpdateDomainInput = {
  id: string,
  nativeId?: number | null,
  nativeFundingPotId?: number | null,
  nativeSkillId?: number | null,
  name?: string | null,
  description?: string | null,
  color?: DomainColor | null,
  colonyDomainsId?: string | null,
  domainParentId?: string | null,
};

export type DeleteDomainInput = {
  id: string,
};

export type CreateColonyFundsClaimInput = {
  id?: string | null,
  createdAtBlock: number,
  createdAt?: string | null,
  amount: string,
  colonyFundsClaimsId?: string | null,
  colonyFundsClaimTokenId: string,
};

export type ModelColonyFundsClaimConditionInput = {
  createdAtBlock?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  amount?: ModelStringInput | null,
  and?: Array< ModelColonyFundsClaimConditionInput | null > | null,
  or?: Array< ModelColonyFundsClaimConditionInput | null > | null,
  not?: ModelColonyFundsClaimConditionInput | null,
  colonyFundsClaimsId?: ModelIDInput | null,
  colonyFundsClaimTokenId?: ModelIDInput | null,
};

export type UpdateColonyFundsClaimInput = {
  id: string,
  createdAtBlock?: number | null,
  createdAt?: string | null,
  amount?: string | null,
  colonyFundsClaimsId?: string | null,
  colonyFundsClaimTokenId: string,
};

export type DeleteColonyFundsClaimInput = {
  id: string,
};

export type CreateContractEventInput = {
  id?: string | null,
  name: string,
  signature: string,
  meta: MetadataInput,
  agent: string,
  target: string,
  encodedArguments?: string | null,
  contractEventColonyId?: string | null,
  contractEventTokenId?: string | null,
  contractEventDomainId?: string | null,
  contractEventUserId?: string | null,
};

export type ModelContractEventConditionInput = {
  name?: ModelStringInput | null,
  signature?: ModelStringInput | null,
  agent?: ModelStringInput | null,
  target?: ModelStringInput | null,
  encodedArguments?: ModelStringInput | null,
  and?: Array< ModelContractEventConditionInput | null > | null,
  or?: Array< ModelContractEventConditionInput | null > | null,
  not?: ModelContractEventConditionInput | null,
  contractEventColonyId?: ModelIDInput | null,
  contractEventTokenId?: ModelIDInput | null,
  contractEventDomainId?: ModelIDInput | null,
  contractEventUserId?: ModelIDInput | null,
};

export type ContractEvent = {
  __typename: "ContractEvent",
  id: string,
  name: string,
  signature: string,
  meta: Metadata,
  colony?: Colony | null,
  token?: Token | null,
  domain?: Domain | null,
  user?: User | null,
  agent: string,
  target: string,
  encodedArguments?: string | null,
  createdAt: string,
  updatedAt: string,
  contractEventColonyId?: string | null,
  contractEventTokenId?: string | null,
  contractEventDomainId?: string | null,
  contractEventUserId?: string | null,
};

export type UpdateContractEventInput = {
  id: string,
  name?: string | null,
  signature?: string | null,
  meta?: MetadataInput | null,
  agent?: string | null,
  target?: string | null,
  encodedArguments?: string | null,
  contractEventColonyId?: string | null,
  contractEventTokenId?: string | null,
  contractEventDomainId?: string | null,
  contractEventUserId?: string | null,
};

export type DeleteContractEventInput = {
  id: string,
};

export type CreateColonyTokensInput = {
  id?: string | null,
  tokenID: string,
  colonyID: string,
};

export type ModelColonyTokensConditionInput = {
  tokenID?: ModelIDInput | null,
  colonyID?: ModelIDInput | null,
  and?: Array< ModelColonyTokensConditionInput | null > | null,
  or?: Array< ModelColonyTokensConditionInput | null > | null,
  not?: ModelColonyTokensConditionInput | null,
};

export type UpdateColonyTokensInput = {
  id: string,
  tokenID?: string | null,
  colonyID?: string | null,
};

export type DeleteColonyTokensInput = {
  id: string,
};

export type CreateUserTokensInput = {
  id?: string | null,
  tokenID: string,
  userID: string,
};

export type ModelUserTokensConditionInput = {
  tokenID?: ModelIDInput | null,
  userID?: ModelIDInput | null,
  and?: Array< ModelUserTokensConditionInput | null > | null,
  or?: Array< ModelUserTokensConditionInput | null > | null,
  not?: ModelUserTokensConditionInput | null,
};

export type UpdateUserTokensInput = {
  id: string,
  tokenID?: string | null,
  userID?: string | null,
};

export type DeleteUserTokensInput = {
  id: string,
};

export type CreateWatchedColoniesInput = {
  id?: string | null,
  colonyID: string,
  userID: string,
};

export type ModelWatchedColoniesConditionInput = {
  colonyID?: ModelIDInput | null,
  userID?: ModelIDInput | null,
  and?: Array< ModelWatchedColoniesConditionInput | null > | null,
  or?: Array< ModelWatchedColoniesConditionInput | null > | null,
  not?: ModelWatchedColoniesConditionInput | null,
};

export type UpdateWatchedColoniesInput = {
  id: string,
  colonyID?: string | null,
  userID?: string | null,
};

export type DeleteWatchedColoniesInput = {
  id: string,
};

export type TokenFromEverywhereArguments = {
  tokenAddress: string,
};

export type TokenFromEverywhereReturn = {
  __typename: "TokenFromEverywhereReturn",
  items?:  Array<Token | null > | null,
};

export type GetUserReputationInput = {
  walletAddress: string,
  colonyAddress: string,
  domainId?: number | null,
  rootHash?: string | null,
};

export type ModelTokenFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  symbol?: ModelStringInput | null,
  decimals?: ModelIntInput | null,
  type?: ModelTokenTypeInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelTokenFilterInput | null > | null,
  or?: Array< ModelTokenFilterInput | null > | null,
  not?: ModelTokenFilterInput | null,
};

export type ModelTokenConnection = {
  __typename: "ModelTokenConnection",
  items:  Array<Token | null >,
  nextToken?: string | null,
};

export type ModelColonyFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  type?: ModelColonyTypeInput | null,
  and?: Array< ModelColonyFilterInput | null > | null,
  or?: Array< ModelColonyFilterInput | null > | null,
  not?: ModelColonyFilterInput | null,
  colonyNativeTokenId?: ModelIDInput | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelDomainFilterInput = {
  id?: ModelIDInput | null,
  nativeId?: ModelIntInput | null,
  nativeFundingPotId?: ModelIntInput | null,
  nativeSkillId?: ModelIntInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  color?: ModelDomainColorInput | null,
  and?: Array< ModelDomainFilterInput | null > | null,
  or?: Array< ModelDomainFilterInput | null > | null,
  not?: ModelDomainFilterInput | null,
  colonyDomainsId?: ModelIDInput | null,
  domainParentId?: ModelIDInput | null,
};

export type ModelColonyFundsClaimFilterInput = {
  id?: ModelIDInput | null,
  createdAtBlock?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  amount?: ModelStringInput | null,
  and?: Array< ModelColonyFundsClaimFilterInput | null > | null,
  or?: Array< ModelColonyFundsClaimFilterInput | null > | null,
  not?: ModelColonyFundsClaimFilterInput | null,
  colonyFundsClaimsId?: ModelIDInput | null,
  colonyFundsClaimTokenId?: ModelIDInput | null,
};

export type ModelContractEventFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  signature?: ModelStringInput | null,
  agent?: ModelStringInput | null,
  target?: ModelStringInput | null,
  encodedArguments?: ModelStringInput | null,
  and?: Array< ModelContractEventFilterInput | null > | null,
  or?: Array< ModelContractEventFilterInput | null > | null,
  not?: ModelContractEventFilterInput | null,
  contractEventColonyId?: ModelIDInput | null,
  contractEventTokenId?: ModelIDInput | null,
  contractEventDomainId?: ModelIDInput | null,
  contractEventUserId?: ModelIDInput | null,
};

export type ModelContractEventConnection = {
  __typename: "ModelContractEventConnection",
  items:  Array<ContractEvent | null >,
  nextToken?: string | null,
};

export type ModelColonyTokensFilterInput = {
  id?: ModelIDInput | null,
  tokenID?: ModelIDInput | null,
  colonyID?: ModelIDInput | null,
  and?: Array< ModelColonyTokensFilterInput | null > | null,
  or?: Array< ModelColonyTokensFilterInput | null > | null,
  not?: ModelColonyTokensFilterInput | null,
};

export type ModelUserTokensFilterInput = {
  id?: ModelIDInput | null,
  tokenID?: ModelIDInput | null,
  userID?: ModelIDInput | null,
  and?: Array< ModelUserTokensFilterInput | null > | null,
  or?: Array< ModelUserTokensFilterInput | null > | null,
  not?: ModelUserTokensFilterInput | null,
};

export type ModelWatchedColoniesFilterInput = {
  id?: ModelIDInput | null,
  colonyID?: ModelIDInput | null,
  userID?: ModelIDInput | null,
  and?: Array< ModelWatchedColoniesFilterInput | null > | null,
  or?: Array< ModelWatchedColoniesFilterInput | null > | null,
  not?: ModelWatchedColoniesFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSubscriptionTokenFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  symbol?: ModelSubscriptionStringInput | null,
  decimals?: ModelSubscriptionIntInput | null,
  type?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTokenFilterInput | null > | null,
  or?: Array< ModelSubscriptionTokenFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionColonyFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionColonyFilterInput | null > | null,
  or?: Array< ModelSubscriptionColonyFilterInput | null > | null,
};

export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
};

export type ModelSubscriptionDomainFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  nativeId?: ModelSubscriptionIntInput | null,
  nativeFundingPotId?: ModelSubscriptionIntInput | null,
  nativeSkillId?: ModelSubscriptionIntInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  color?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionDomainFilterInput | null > | null,
  or?: Array< ModelSubscriptionDomainFilterInput | null > | null,
};

export type ModelSubscriptionColonyFundsClaimFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  createdAtBlock?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  amount?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionColonyFundsClaimFilterInput | null > | null,
  or?: Array< ModelSubscriptionColonyFundsClaimFilterInput | null > | null,
};

export type ModelSubscriptionContractEventFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  signature?: ModelSubscriptionStringInput | null,
  agent?: ModelSubscriptionStringInput | null,
  target?: ModelSubscriptionStringInput | null,
  encodedArguments?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionContractEventFilterInput | null > | null,
  or?: Array< ModelSubscriptionContractEventFilterInput | null > | null,
};

export type ModelSubscriptionColonyTokensFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  tokenID?: ModelSubscriptionIDInput | null,
  colonyID?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionColonyTokensFilterInput | null > | null,
  or?: Array< ModelSubscriptionColonyTokensFilterInput | null > | null,
};

export type ModelSubscriptionUserTokensFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  tokenID?: ModelSubscriptionIDInput | null,
  userID?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionUserTokensFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserTokensFilterInput | null > | null,
};

export type ModelSubscriptionWatchedColoniesFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  colonyID?: ModelSubscriptionIDInput | null,
  userID?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionWatchedColoniesFilterInput | null > | null,
  or?: Array< ModelSubscriptionWatchedColoniesFilterInput | null > | null,
};

export type GetFullColonyByNameQueryVariables = {
  name: string,
};

export type GetFullColonyByNameQuery = {
  getColonyByName?:  {
    __typename: "ModelColonyConnection",
    items:  Array< {
      __typename: "Colony",
      colonyAddress: string,
      name: string,
      nativeToken:  {
        __typename: "Token",
        decimals: number,
        tokenAddress: string,
        name: string,
        symbol: string,
        type?: TokenType | null,
      },
      profile?:  {
        __typename: "Profile",
        avatar?: string | null,
        bio?: string | null,
        displayName?: string | null,
        email?: string | null,
        location?: string | null,
        thumbnail?: string | null,
        website?: string | null,
      } | null,
      status?:  {
        __typename: "ColonyStatus",
        recovery?: boolean | null,
        nativeToken?:  {
          __typename: "NativeTokenStatus",
          mintable?: boolean | null,
          unlockable?: boolean | null,
          unlocked?: boolean | null,
        } | null,
      } | null,
      meta?:  {
        __typename: "Metadata",
        chainId?: number | null,
        network?: Network | null,
      } | null,
      tokens?:  {
        __typename: "ModelColonyTokensConnection",
        items:  Array< {
          __typename: "ColonyTokens",
          token:  {
            __typename: "Token",
            decimals: number,
            tokenAddress: string,
            name: string,
            symbol: string,
            type?: TokenType | null,
          },
        } | null >,
      } | null,
      domains?:  {
        __typename: "ModelDomainConnection",
        items:  Array< {
          __typename: "Domain",
          color?: DomainColor | null,
          description?: string | null,
          id: string,
          name?: string | null,
          nativeId: number,
          parentId?: string | null,
        } | null >,
      } | null,
      watchers?:  {
        __typename: "ModelWatchedColoniesConnection",
        items:  Array< {
          __typename: "WatchedColonies",
          user:  {
            __typename: "User",
            walletAddress: string,
            name: string,
            profile?:  {
              __typename: "Profile",
              avatar?: string | null,
              bio?: string | null,
              displayName?: string | null,
              email?: string | null,
              location?: string | null,
              website?: string | null,
              thumbnail?: string | null,
            } | null,
          },
        } | null >,
      } | null,
    } | null >,
  } | null,
};

export type GetMetacolonyQuery = {
  getColonyByType?:  {
    __typename: "ModelColonyConnection",
    items:  Array< {
      __typename: "Colony",
      colonyAddress: string,
      name: string,
      profile?:  {
        __typename: "Profile",
        avatar?: string | null,
        bio?: string | null,
        displayName?: string | null,
        email?: string | null,
        location?: string | null,
        thumbnail?: string | null,
        website?: string | null,
      } | null,
    } | null >,
  } | null,
};

export type GetCurrentUserQueryVariables = {
  address: string,
};

export type GetCurrentUserQuery = {
  getUserByAddress?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      profile?:  {
        __typename: "Profile",
        avatar?: string | null,
        bio?: string | null,
        displayName?: string | null,
        email?: string | null,
        location?: string | null,
        thumbnail?: string | null,
        website?: string | null,
      } | null,
      walletAddress: string,
      name: string,
      watchlist?:  {
        __typename: "ModelWatchedColoniesConnection",
        items:  Array< {
          __typename: "WatchedColonies",
          colony:  {
            __typename: "Colony",
            colonyAddress: string,
            name: string,
            profile?:  {
              __typename: "Profile",
              displayName?: string | null,
              thumbnail?: string | null,
            } | null,
            meta?:  {
              __typename: "Metadata",
              chainId?: number | null,
              network?: Network | null,
            } | null,
          },
          createdAt: string,
        } | null >,
      } | null,
    } | null >,
  } | null,
};

export type CreateUniqueUserMutationVariables = {
  input?: CreateUniqueUserInput | null,
};

export type CreateUniqueUserMutation = {
  createUniqueUser?:  {
    __typename: "User",
    id: string,
    name: string,
    tokens?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    watchlist?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUniqueColonyMutationVariables = {
  input?: CreateUniqueColonyInput | null,
};

export type CreateUniqueColonyMutation = {
  createUniqueColony?:  {
    __typename: "Colony",
    id: string,
    name: string,
    nativeToken:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    tokens?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    status?:  {
      __typename: "ColonyStatus",
      recovery?: boolean | null,
    } | null,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    watchers?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    fundsClaims?:  {
      __typename: "ModelColonyFundsClaimConnection",
      nextToken?: string | null,
    } | null,
    chainFundsClaim?:  {
      __typename: "ColonyChainFundsClaim",
      id: string,
      createdAtBlock: number,
      createdAt: string,
      updatedAt: string,
      amount: string,
    } | null,
    type?: ColonyType | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
};

export type CreateUniqueDomainMutationVariables = {
  input?: CreateUniqueDomainInput | null,
};

export type CreateUniqueDomainMutation = {
  createUniqueDomain?:  {
    __typename: "Domain",
    id: string,
    nativeId: number,
    nativeFundingPotId: number,
    nativeSkillId: number,
    name?: string | null,
    description?: string | null,
    color?: DomainColor | null,
    parent?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    domainParentId?: string | null,
  } | null,
};

export type CreateTokenMutationVariables = {
  input: CreateTokenInput,
  condition?: ModelTokenConditionInput | null,
};

export type CreateTokenMutation = {
  createToken?:  {
    __typename: "Token",
    id: string,
    name: string,
    symbol: string,
    decimals: number,
    type?: TokenType | null,
    colonies?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    users?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTokenMutationVariables = {
  input: UpdateTokenInput,
  condition?: ModelTokenConditionInput | null,
};

export type UpdateTokenMutation = {
  updateToken?:  {
    __typename: "Token",
    id: string,
    name: string,
    symbol: string,
    decimals: number,
    type?: TokenType | null,
    colonies?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    users?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTokenMutationVariables = {
  input: DeleteTokenInput,
  condition?: ModelTokenConditionInput | null,
};

export type DeleteTokenMutation = {
  deleteToken?:  {
    __typename: "Token",
    id: string,
    name: string,
    symbol: string,
    decimals: number,
    type?: TokenType | null,
    colonies?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    users?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateColonyMutationVariables = {
  input: CreateColonyInput,
  condition?: ModelColonyConditionInput | null,
};

export type CreateColonyMutation = {
  createColony?:  {
    __typename: "Colony",
    id: string,
    name: string,
    nativeToken:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    tokens?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    status?:  {
      __typename: "ColonyStatus",
      recovery?: boolean | null,
    } | null,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    watchers?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    fundsClaims?:  {
      __typename: "ModelColonyFundsClaimConnection",
      nextToken?: string | null,
    } | null,
    chainFundsClaim?:  {
      __typename: "ColonyChainFundsClaim",
      id: string,
      createdAtBlock: number,
      createdAt: string,
      updatedAt: string,
      amount: string,
    } | null,
    type?: ColonyType | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
};

export type UpdateColonyMutationVariables = {
  input: UpdateColonyInput,
  condition?: ModelColonyConditionInput | null,
};

export type UpdateColonyMutation = {
  updateColony?:  {
    __typename: "Colony",
    id: string,
    name: string,
    nativeToken:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    tokens?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    status?:  {
      __typename: "ColonyStatus",
      recovery?: boolean | null,
    } | null,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    watchers?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    fundsClaims?:  {
      __typename: "ModelColonyFundsClaimConnection",
      nextToken?: string | null,
    } | null,
    chainFundsClaim?:  {
      __typename: "ColonyChainFundsClaim",
      id: string,
      createdAtBlock: number,
      createdAt: string,
      updatedAt: string,
      amount: string,
    } | null,
    type?: ColonyType | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
};

export type DeleteColonyMutationVariables = {
  input: DeleteColonyInput,
  condition?: ModelColonyConditionInput | null,
};

export type DeleteColonyMutation = {
  deleteColony?:  {
    __typename: "Colony",
    id: string,
    name: string,
    nativeToken:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    tokens?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    status?:  {
      __typename: "ColonyStatus",
      recovery?: boolean | null,
    } | null,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    watchers?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    fundsClaims?:  {
      __typename: "ModelColonyFundsClaimConnection",
      nextToken?: string | null,
    } | null,
    chainFundsClaim?:  {
      __typename: "ColonyChainFundsClaim",
      id: string,
      createdAtBlock: number,
      createdAt: string,
      updatedAt: string,
      amount: string,
    } | null,
    type?: ColonyType | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name: string,
    tokens?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    watchlist?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    tokens?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    watchlist?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    tokens?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    watchlist?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateDomainMutationVariables = {
  input: CreateDomainInput,
  condition?: ModelDomainConditionInput | null,
};

export type CreateDomainMutation = {
  createDomain?:  {
    __typename: "Domain",
    id: string,
    nativeId: number,
    nativeFundingPotId: number,
    nativeSkillId: number,
    name?: string | null,
    description?: string | null,
    color?: DomainColor | null,
    parent?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    domainParentId?: string | null,
  } | null,
};

export type UpdateDomainMutationVariables = {
  input: UpdateDomainInput,
  condition?: ModelDomainConditionInput | null,
};

export type UpdateDomainMutation = {
  updateDomain?:  {
    __typename: "Domain",
    id: string,
    nativeId: number,
    nativeFundingPotId: number,
    nativeSkillId: number,
    name?: string | null,
    description?: string | null,
    color?: DomainColor | null,
    parent?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    domainParentId?: string | null,
  } | null,
};

export type DeleteDomainMutationVariables = {
  input: DeleteDomainInput,
  condition?: ModelDomainConditionInput | null,
};

export type DeleteDomainMutation = {
  deleteDomain?:  {
    __typename: "Domain",
    id: string,
    nativeId: number,
    nativeFundingPotId: number,
    nativeSkillId: number,
    name?: string | null,
    description?: string | null,
    color?: DomainColor | null,
    parent?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    domainParentId?: string | null,
  } | null,
};

export type CreateColonyFundsClaimMutationVariables = {
  input: CreateColonyFundsClaimInput,
  condition?: ModelColonyFundsClaimConditionInput | null,
};

export type CreateColonyFundsClaimMutation = {
  createColonyFundsClaim?:  {
    __typename: "ColonyFundsClaim",
    id: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    createdAtBlock: number,
    createdAt: string,
    amount: string,
    updatedAt: string,
    colonyFundsClaimsId?: string | null,
    colonyFundsClaimTokenId: string,
  } | null,
};

export type UpdateColonyFundsClaimMutationVariables = {
  input: UpdateColonyFundsClaimInput,
  condition?: ModelColonyFundsClaimConditionInput | null,
};

export type UpdateColonyFundsClaimMutation = {
  updateColonyFundsClaim?:  {
    __typename: "ColonyFundsClaim",
    id: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    createdAtBlock: number,
    createdAt: string,
    amount: string,
    updatedAt: string,
    colonyFundsClaimsId?: string | null,
    colonyFundsClaimTokenId: string,
  } | null,
};

export type DeleteColonyFundsClaimMutationVariables = {
  input: DeleteColonyFundsClaimInput,
  condition?: ModelColonyFundsClaimConditionInput | null,
};

export type DeleteColonyFundsClaimMutation = {
  deleteColonyFundsClaim?:  {
    __typename: "ColonyFundsClaim",
    id: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    createdAtBlock: number,
    createdAt: string,
    amount: string,
    updatedAt: string,
    colonyFundsClaimsId?: string | null,
    colonyFundsClaimTokenId: string,
  } | null,
};

export type CreateContractEventMutationVariables = {
  input: CreateContractEventInput,
  condition?: ModelContractEventConditionInput | null,
};

export type CreateContractEventMutation = {
  createContractEvent?:  {
    __typename: "ContractEvent",
    id: string,
    name: string,
    signature: string,
    meta:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    },
    colony?:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null,
    token?:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    domain?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    agent: string,
    target: string,
    encodedArguments?: string | null,
    createdAt: string,
    updatedAt: string,
    contractEventColonyId?: string | null,
    contractEventTokenId?: string | null,
    contractEventDomainId?: string | null,
    contractEventUserId?: string | null,
  } | null,
};

export type UpdateContractEventMutationVariables = {
  input: UpdateContractEventInput,
  condition?: ModelContractEventConditionInput | null,
};

export type UpdateContractEventMutation = {
  updateContractEvent?:  {
    __typename: "ContractEvent",
    id: string,
    name: string,
    signature: string,
    meta:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    },
    colony?:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null,
    token?:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    domain?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    agent: string,
    target: string,
    encodedArguments?: string | null,
    createdAt: string,
    updatedAt: string,
    contractEventColonyId?: string | null,
    contractEventTokenId?: string | null,
    contractEventDomainId?: string | null,
    contractEventUserId?: string | null,
  } | null,
};

export type DeleteContractEventMutationVariables = {
  input: DeleteContractEventInput,
  condition?: ModelContractEventConditionInput | null,
};

export type DeleteContractEventMutation = {
  deleteContractEvent?:  {
    __typename: "ContractEvent",
    id: string,
    name: string,
    signature: string,
    meta:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    },
    colony?:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null,
    token?:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    domain?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    agent: string,
    target: string,
    encodedArguments?: string | null,
    createdAt: string,
    updatedAt: string,
    contractEventColonyId?: string | null,
    contractEventTokenId?: string | null,
    contractEventDomainId?: string | null,
    contractEventUserId?: string | null,
  } | null,
};

export type CreateColonyTokensMutationVariables = {
  input: CreateColonyTokensInput,
  condition?: ModelColonyTokensConditionInput | null,
};

export type CreateColonyTokensMutation = {
  createColonyTokens?:  {
    __typename: "ColonyTokens",
    id: string,
    tokenID: string,
    colonyID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateColonyTokensMutationVariables = {
  input: UpdateColonyTokensInput,
  condition?: ModelColonyTokensConditionInput | null,
};

export type UpdateColonyTokensMutation = {
  updateColonyTokens?:  {
    __typename: "ColonyTokens",
    id: string,
    tokenID: string,
    colonyID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteColonyTokensMutationVariables = {
  input: DeleteColonyTokensInput,
  condition?: ModelColonyTokensConditionInput | null,
};

export type DeleteColonyTokensMutation = {
  deleteColonyTokens?:  {
    __typename: "ColonyTokens",
    id: string,
    tokenID: string,
    colonyID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserTokensMutationVariables = {
  input: CreateUserTokensInput,
  condition?: ModelUserTokensConditionInput | null,
};

export type CreateUserTokensMutation = {
  createUserTokens?:  {
    __typename: "UserTokens",
    id: string,
    tokenID: string,
    userID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserTokensMutationVariables = {
  input: UpdateUserTokensInput,
  condition?: ModelUserTokensConditionInput | null,
};

export type UpdateUserTokensMutation = {
  updateUserTokens?:  {
    __typename: "UserTokens",
    id: string,
    tokenID: string,
    userID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserTokensMutationVariables = {
  input: DeleteUserTokensInput,
  condition?: ModelUserTokensConditionInput | null,
};

export type DeleteUserTokensMutation = {
  deleteUserTokens?:  {
    __typename: "UserTokens",
    id: string,
    tokenID: string,
    userID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateWatchedColoniesMutationVariables = {
  input: CreateWatchedColoniesInput,
  condition?: ModelWatchedColoniesConditionInput | null,
};

export type CreateWatchedColoniesMutation = {
  createWatchedColonies?:  {
    __typename: "WatchedColonies",
    id: string,
    colonyID: string,
    userID: string,
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateWatchedColoniesMutationVariables = {
  input: UpdateWatchedColoniesInput,
  condition?: ModelWatchedColoniesConditionInput | null,
};

export type UpdateWatchedColoniesMutation = {
  updateWatchedColonies?:  {
    __typename: "WatchedColonies",
    id: string,
    colonyID: string,
    userID: string,
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteWatchedColoniesMutationVariables = {
  input: DeleteWatchedColoniesInput,
  condition?: ModelWatchedColoniesConditionInput | null,
};

export type DeleteWatchedColoniesMutation = {
  deleteWatchedColonies?:  {
    __typename: "WatchedColonies",
    id: string,
    colonyID: string,
    userID: string,
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetTokenFromEverywhereQueryVariables = {
  input?: TokenFromEverywhereArguments | null,
};

export type GetTokenFromEverywhereQuery = {
  getTokenFromEverywhere?:  {
    __typename: "TokenFromEverywhereReturn",
    items?:  Array< {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
  } | null,
};

export type GetUserReputationQueryVariables = {
  input?: GetUserReputationInput | null,
};

export type GetUserReputationQuery = {
  getUserReputation?: string | null,
};

export type GetTokenQueryVariables = {
  id: string,
};

export type GetTokenQuery = {
  getToken?:  {
    __typename: "Token",
    id: string,
    name: string,
    symbol: string,
    decimals: number,
    type?: TokenType | null,
    colonies?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    users?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTokensQueryVariables = {
  filter?: ModelTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTokensQuery = {
  listTokens?:  {
    __typename: "ModelTokenConnection",
    items:  Array< {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetColonyQueryVariables = {
  id: string,
};

export type GetColonyQuery = {
  getColony?:  {
    __typename: "Colony",
    id: string,
    name: string,
    nativeToken:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    tokens?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    status?:  {
      __typename: "ColonyStatus",
      recovery?: boolean | null,
    } | null,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    watchers?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    fundsClaims?:  {
      __typename: "ModelColonyFundsClaimConnection",
      nextToken?: string | null,
    } | null,
    chainFundsClaim?:  {
      __typename: "ColonyChainFundsClaim",
      id: string,
      createdAtBlock: number,
      createdAt: string,
      updatedAt: string,
      amount: string,
    } | null,
    type?: ColonyType | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
};

export type ListColoniesQueryVariables = {
  filter?: ModelColonyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListColoniesQuery = {
  listColonies?:  {
    __typename: "ModelColonyConnection",
    items:  Array< {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name: string,
    tokens?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    watchlist?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetDomainQueryVariables = {
  id: string,
};

export type GetDomainQuery = {
  getDomain?:  {
    __typename: "Domain",
    id: string,
    nativeId: number,
    nativeFundingPotId: number,
    nativeSkillId: number,
    name?: string | null,
    description?: string | null,
    color?: DomainColor | null,
    parent?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    domainParentId?: string | null,
  } | null,
};

export type ListDomainsQueryVariables = {
  filter?: ModelDomainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDomainsQuery = {
  listDomains?:  {
    __typename: "ModelDomainConnection",
    items:  Array< {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetColonyFundsClaimQueryVariables = {
  id: string,
};

export type GetColonyFundsClaimQuery = {
  getColonyFundsClaim?:  {
    __typename: "ColonyFundsClaim",
    id: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    createdAtBlock: number,
    createdAt: string,
    amount: string,
    updatedAt: string,
    colonyFundsClaimsId?: string | null,
    colonyFundsClaimTokenId: string,
  } | null,
};

export type ListColonyFundsClaimsQueryVariables = {
  filter?: ModelColonyFundsClaimFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListColonyFundsClaimsQuery = {
  listColonyFundsClaims?:  {
    __typename: "ModelColonyFundsClaimConnection",
    items:  Array< {
      __typename: "ColonyFundsClaim",
      id: string,
      createdAtBlock: number,
      createdAt: string,
      amount: string,
      updatedAt: string,
      colonyFundsClaimsId?: string | null,
      colonyFundsClaimTokenId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetContractEventQueryVariables = {
  id: string,
};

export type GetContractEventQuery = {
  getContractEvent?:  {
    __typename: "ContractEvent",
    id: string,
    name: string,
    signature: string,
    meta:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    },
    colony?:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null,
    token?:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    domain?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    agent: string,
    target: string,
    encodedArguments?: string | null,
    createdAt: string,
    updatedAt: string,
    contractEventColonyId?: string | null,
    contractEventTokenId?: string | null,
    contractEventDomainId?: string | null,
    contractEventUserId?: string | null,
  } | null,
};

export type ListContractEventsQueryVariables = {
  filter?: ModelContractEventFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListContractEventsQuery = {
  listContractEvents?:  {
    __typename: "ModelContractEventConnection",
    items:  Array< {
      __typename: "ContractEvent",
      id: string,
      name: string,
      signature: string,
      agent: string,
      target: string,
      encodedArguments?: string | null,
      createdAt: string,
      updatedAt: string,
      contractEventColonyId?: string | null,
      contractEventTokenId?: string | null,
      contractEventDomainId?: string | null,
      contractEventUserId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetColonyTokensQueryVariables = {
  id: string,
};

export type GetColonyTokensQuery = {
  getColonyTokens?:  {
    __typename: "ColonyTokens",
    id: string,
    tokenID: string,
    colonyID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListColonyTokensQueryVariables = {
  filter?: ModelColonyTokensFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListColonyTokensQuery = {
  listColonyTokens?:  {
    __typename: "ModelColonyTokensConnection",
    items:  Array< {
      __typename: "ColonyTokens",
      id: string,
      tokenID: string,
      colonyID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserTokensQueryVariables = {
  id: string,
};

export type GetUserTokensQuery = {
  getUserTokens?:  {
    __typename: "UserTokens",
    id: string,
    tokenID: string,
    userID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserTokensQueryVariables = {
  filter?: ModelUserTokensFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserTokensQuery = {
  listUserTokens?:  {
    __typename: "ModelUserTokensConnection",
    items:  Array< {
      __typename: "UserTokens",
      id: string,
      tokenID: string,
      userID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetWatchedColoniesQueryVariables = {
  id: string,
};

export type GetWatchedColoniesQuery = {
  getWatchedColonies?:  {
    __typename: "WatchedColonies",
    id: string,
    colonyID: string,
    userID: string,
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListWatchedColoniesQueryVariables = {
  filter?: ModelWatchedColoniesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWatchedColoniesQuery = {
  listWatchedColonies?:  {
    __typename: "ModelWatchedColoniesConnection",
    items:  Array< {
      __typename: "WatchedColonies",
      id: string,
      colonyID: string,
      userID: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTokenByAddressQueryVariables = {
  id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetTokenByAddressQuery = {
  getTokenByAddress?:  {
    __typename: "ModelTokenConnection",
    items:  Array< {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTokensByTypeQueryVariables = {
  type: TokenType,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetTokensByTypeQuery = {
  getTokensByType?:  {
    __typename: "ModelTokenConnection",
    items:  Array< {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetColonyByAddressQueryVariables = {
  id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelColonyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetColonyByAddressQuery = {
  getColonyByAddress?:  {
    __typename: "ModelColonyConnection",
    items:  Array< {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetColonyByNameQueryVariables = {
  name: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelColonyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetColonyByNameQuery = {
  getColonyByName?:  {
    __typename: "ModelColonyConnection",
    items:  Array< {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetColonyByTypeQueryVariables = {
  type: ColonyType,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelColonyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetColonyByTypeQuery = {
  getColonyByType?:  {
    __typename: "ModelColonyConnection",
    items:  Array< {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserByAddressQueryVariables = {
  id: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetUserByAddressQuery = {
  getUserByAddress?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserByNameQueryVariables = {
  name: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetUserByNameQuery = {
  getUserByName?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateTokenSubscriptionVariables = {
  filter?: ModelSubscriptionTokenFilterInput | null,
};

export type OnCreateTokenSubscription = {
  onCreateToken?:  {
    __typename: "Token",
    id: string,
    name: string,
    symbol: string,
    decimals: number,
    type?: TokenType | null,
    colonies?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    users?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTokenSubscriptionVariables = {
  filter?: ModelSubscriptionTokenFilterInput | null,
};

export type OnUpdateTokenSubscription = {
  onUpdateToken?:  {
    __typename: "Token",
    id: string,
    name: string,
    symbol: string,
    decimals: number,
    type?: TokenType | null,
    colonies?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    users?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTokenSubscriptionVariables = {
  filter?: ModelSubscriptionTokenFilterInput | null,
};

export type OnDeleteTokenSubscription = {
  onDeleteToken?:  {
    __typename: "Token",
    id: string,
    name: string,
    symbol: string,
    decimals: number,
    type?: TokenType | null,
    colonies?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    users?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateColonySubscriptionVariables = {
  filter?: ModelSubscriptionColonyFilterInput | null,
};

export type OnCreateColonySubscription = {
  onCreateColony?:  {
    __typename: "Colony",
    id: string,
    name: string,
    nativeToken:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    tokens?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    status?:  {
      __typename: "ColonyStatus",
      recovery?: boolean | null,
    } | null,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    watchers?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    fundsClaims?:  {
      __typename: "ModelColonyFundsClaimConnection",
      nextToken?: string | null,
    } | null,
    chainFundsClaim?:  {
      __typename: "ColonyChainFundsClaim",
      id: string,
      createdAtBlock: number,
      createdAt: string,
      updatedAt: string,
      amount: string,
    } | null,
    type?: ColonyType | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
};

export type OnUpdateColonySubscriptionVariables = {
  filter?: ModelSubscriptionColonyFilterInput | null,
};

export type OnUpdateColonySubscription = {
  onUpdateColony?:  {
    __typename: "Colony",
    id: string,
    name: string,
    nativeToken:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    tokens?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    status?:  {
      __typename: "ColonyStatus",
      recovery?: boolean | null,
    } | null,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    watchers?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    fundsClaims?:  {
      __typename: "ModelColonyFundsClaimConnection",
      nextToken?: string | null,
    } | null,
    chainFundsClaim?:  {
      __typename: "ColonyChainFundsClaim",
      id: string,
      createdAtBlock: number,
      createdAt: string,
      updatedAt: string,
      amount: string,
    } | null,
    type?: ColonyType | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
};

export type OnDeleteColonySubscriptionVariables = {
  filter?: ModelSubscriptionColonyFilterInput | null,
};

export type OnDeleteColonySubscription = {
  onDeleteColony?:  {
    __typename: "Colony",
    id: string,
    name: string,
    nativeToken:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    tokens?:  {
      __typename: "ModelColonyTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    status?:  {
      __typename: "ColonyStatus",
      recovery?: boolean | null,
    } | null,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    watchers?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    fundsClaims?:  {
      __typename: "ModelColonyFundsClaimConnection",
      nextToken?: string | null,
    } | null,
    chainFundsClaim?:  {
      __typename: "ColonyChainFundsClaim",
      id: string,
      createdAtBlock: number,
      createdAt: string,
      updatedAt: string,
      amount: string,
    } | null,
    type?: ColonyType | null,
    meta?:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    tokens?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    watchlist?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    name: string,
    tokens?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    watchlist?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    name: string,
    tokens?:  {
      __typename: "ModelUserTokensConnection",
      nextToken?: string | null,
    } | null,
    profile?:  {
      __typename: "Profile",
      avatar?: string | null,
      thumbnail?: string | null,
      displayName?: string | null,
      bio?: string | null,
      location?: string | null,
      website?: string | null,
      email?: string | null,
    } | null,
    watchlist?:  {
      __typename: "ModelWatchedColoniesConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateDomainSubscriptionVariables = {
  filter?: ModelSubscriptionDomainFilterInput | null,
};

export type OnCreateDomainSubscription = {
  onCreateDomain?:  {
    __typename: "Domain",
    id: string,
    nativeId: number,
    nativeFundingPotId: number,
    nativeSkillId: number,
    name?: string | null,
    description?: string | null,
    color?: DomainColor | null,
    parent?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    domainParentId?: string | null,
  } | null,
};

export type OnUpdateDomainSubscriptionVariables = {
  filter?: ModelSubscriptionDomainFilterInput | null,
};

export type OnUpdateDomainSubscription = {
  onUpdateDomain?:  {
    __typename: "Domain",
    id: string,
    nativeId: number,
    nativeFundingPotId: number,
    nativeSkillId: number,
    name?: string | null,
    description?: string | null,
    color?: DomainColor | null,
    parent?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    domainParentId?: string | null,
  } | null,
};

export type OnDeleteDomainSubscriptionVariables = {
  filter?: ModelSubscriptionDomainFilterInput | null,
};

export type OnDeleteDomainSubscription = {
  onDeleteDomain?:  {
    __typename: "Domain",
    id: string,
    nativeId: number,
    nativeFundingPotId: number,
    nativeSkillId: number,
    name?: string | null,
    description?: string | null,
    color?: DomainColor | null,
    parent?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    domainParentId?: string | null,
  } | null,
};

export type OnCreateColonyFundsClaimSubscriptionVariables = {
  filter?: ModelSubscriptionColonyFundsClaimFilterInput | null,
};

export type OnCreateColonyFundsClaimSubscription = {
  onCreateColonyFundsClaim?:  {
    __typename: "ColonyFundsClaim",
    id: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    createdAtBlock: number,
    createdAt: string,
    amount: string,
    updatedAt: string,
    colonyFundsClaimsId?: string | null,
    colonyFundsClaimTokenId: string,
  } | null,
};

export type OnUpdateColonyFundsClaimSubscriptionVariables = {
  filter?: ModelSubscriptionColonyFundsClaimFilterInput | null,
};

export type OnUpdateColonyFundsClaimSubscription = {
  onUpdateColonyFundsClaim?:  {
    __typename: "ColonyFundsClaim",
    id: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    createdAtBlock: number,
    createdAt: string,
    amount: string,
    updatedAt: string,
    colonyFundsClaimsId?: string | null,
    colonyFundsClaimTokenId: string,
  } | null,
};

export type OnDeleteColonyFundsClaimSubscriptionVariables = {
  filter?: ModelSubscriptionColonyFundsClaimFilterInput | null,
};

export type OnDeleteColonyFundsClaimSubscription = {
  onDeleteColonyFundsClaim?:  {
    __typename: "ColonyFundsClaim",
    id: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    createdAtBlock: number,
    createdAt: string,
    amount: string,
    updatedAt: string,
    colonyFundsClaimsId?: string | null,
    colonyFundsClaimTokenId: string,
  } | null,
};

export type OnCreateContractEventSubscriptionVariables = {
  filter?: ModelSubscriptionContractEventFilterInput | null,
};

export type OnCreateContractEventSubscription = {
  onCreateContractEvent?:  {
    __typename: "ContractEvent",
    id: string,
    name: string,
    signature: string,
    meta:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    },
    colony?:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null,
    token?:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    domain?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    agent: string,
    target: string,
    encodedArguments?: string | null,
    createdAt: string,
    updatedAt: string,
    contractEventColonyId?: string | null,
    contractEventTokenId?: string | null,
    contractEventDomainId?: string | null,
    contractEventUserId?: string | null,
  } | null,
};

export type OnUpdateContractEventSubscriptionVariables = {
  filter?: ModelSubscriptionContractEventFilterInput | null,
};

export type OnUpdateContractEventSubscription = {
  onUpdateContractEvent?:  {
    __typename: "ContractEvent",
    id: string,
    name: string,
    signature: string,
    meta:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    },
    colony?:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null,
    token?:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    domain?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    agent: string,
    target: string,
    encodedArguments?: string | null,
    createdAt: string,
    updatedAt: string,
    contractEventColonyId?: string | null,
    contractEventTokenId?: string | null,
    contractEventDomainId?: string | null,
    contractEventUserId?: string | null,
  } | null,
};

export type OnDeleteContractEventSubscriptionVariables = {
  filter?: ModelSubscriptionContractEventFilterInput | null,
};

export type OnDeleteContractEventSubscription = {
  onDeleteContractEvent?:  {
    __typename: "ContractEvent",
    id: string,
    name: string,
    signature: string,
    meta:  {
      __typename: "Metadata",
      network?: Network | null,
      chainId?: number | null,
      transactionHash?: string | null,
      logIndex?: number | null,
      blockNumber?: number | null,
    },
    colony?:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null,
    token?:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    domain?:  {
      __typename: "Domain",
      id: string,
      nativeId: number,
      nativeFundingPotId: number,
      nativeSkillId: number,
      name?: string | null,
      description?: string | null,
      color?: DomainColor | null,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      domainParentId?: string | null,
    } | null,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    agent: string,
    target: string,
    encodedArguments?: string | null,
    createdAt: string,
    updatedAt: string,
    contractEventColonyId?: string | null,
    contractEventTokenId?: string | null,
    contractEventDomainId?: string | null,
    contractEventUserId?: string | null,
  } | null,
};

export type OnCreateColonyTokensSubscriptionVariables = {
  filter?: ModelSubscriptionColonyTokensFilterInput | null,
};

export type OnCreateColonyTokensSubscription = {
  onCreateColonyTokens?:  {
    __typename: "ColonyTokens",
    id: string,
    tokenID: string,
    colonyID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateColonyTokensSubscriptionVariables = {
  filter?: ModelSubscriptionColonyTokensFilterInput | null,
};

export type OnUpdateColonyTokensSubscription = {
  onUpdateColonyTokens?:  {
    __typename: "ColonyTokens",
    id: string,
    tokenID: string,
    colonyID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteColonyTokensSubscriptionVariables = {
  filter?: ModelSubscriptionColonyTokensFilterInput | null,
};

export type OnDeleteColonyTokensSubscription = {
  onDeleteColonyTokens?:  {
    __typename: "ColonyTokens",
    id: string,
    tokenID: string,
    colonyID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserTokensSubscriptionVariables = {
  filter?: ModelSubscriptionUserTokensFilterInput | null,
};

export type OnCreateUserTokensSubscription = {
  onCreateUserTokens?:  {
    __typename: "UserTokens",
    id: string,
    tokenID: string,
    userID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserTokensSubscriptionVariables = {
  filter?: ModelSubscriptionUserTokensFilterInput | null,
};

export type OnUpdateUserTokensSubscription = {
  onUpdateUserTokens?:  {
    __typename: "UserTokens",
    id: string,
    tokenID: string,
    userID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserTokensSubscriptionVariables = {
  filter?: ModelSubscriptionUserTokensFilterInput | null,
};

export type OnDeleteUserTokensSubscription = {
  onDeleteUserTokens?:  {
    __typename: "UserTokens",
    id: string,
    tokenID: string,
    userID: string,
    token:  {
      __typename: "Token",
      id: string,
      name: string,
      symbol: string,
      decimals: number,
      type?: TokenType | null,
      createdAt: string,
      updatedAt: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateWatchedColoniesSubscriptionVariables = {
  filter?: ModelSubscriptionWatchedColoniesFilterInput | null,
};

export type OnCreateWatchedColoniesSubscription = {
  onCreateWatchedColonies?:  {
    __typename: "WatchedColonies",
    id: string,
    colonyID: string,
    userID: string,
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateWatchedColoniesSubscriptionVariables = {
  filter?: ModelSubscriptionWatchedColoniesFilterInput | null,
};

export type OnUpdateWatchedColoniesSubscription = {
  onUpdateWatchedColonies?:  {
    __typename: "WatchedColonies",
    id: string,
    colonyID: string,
    userID: string,
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteWatchedColoniesSubscriptionVariables = {
  filter?: ModelSubscriptionWatchedColoniesFilterInput | null,
};

export type OnDeleteWatchedColoniesSubscription = {
  onDeleteWatchedColonies?:  {
    __typename: "WatchedColonies",
    id: string,
    colonyID: string,
    userID: string,
    colony:  {
      __typename: "Colony",
      id: string,
      name: string,
      type?: ColonyType | null,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    user:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};
