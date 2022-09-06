/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateChainMetaInput = {
  confirmedOnChain: boolean,
  id?: string | null,
};

export type ModelChainMetaConditionInput = {
  confirmedOnChain?: ModelBooleanInput | null,
  and?: Array< ModelChainMetaConditionInput | null > | null,
  or?: Array< ModelChainMetaConditionInput | null > | null,
  not?: ModelChainMetaConditionInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
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


export type ChainMeta = {
  __typename: "ChainMeta",
  confirmedOnChain: boolean,
  id: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateChainMetaInput = {
  confirmedOnChain?: boolean | null,
  id: string,
};

export type DeleteChainMetaInput = {
  id: string,
};

export type CreateUserInput = {
  walletAddress: string,
  username: string,
  displayName?: string | null,
  avatarHash?: string | null,
};

export type ModelUserConditionInput = {
  displayName?: ModelStringInput | null,
  avatarHash?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
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

export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type User = {
  __typename: "User",
  walletAddress: string,
  username: string,
  displayName?: string | null,
  avatarHash?: string | null,
  roles?:  Array<ColonyRole | null > | null,
  tokens?: ModelTokenConnection | null,
  chainMeta?: ChainMeta | null,
  createdAt: string,
  updatedAt: string,
};

export type ColonyRole = {
  __typename: "ColonyRole",
  colony?: Colony | null,
  roles?: ModelRoleConnection | null,
  id: string,
  createdAt: string,
  updatedAt: string,
  colonyRoleColonyId?: string | null,
  colonyRoleColonyName?: string | null,
};

export type Colony = {
  __typename: "Colony",
  internalId: string,
  chainId: number,
  chain: number,
  contractAddress: string,
  name: string,
  displayName?: string | null,
  avatarHash?: string | null,
  nativeToken?: Token | null,
  chainVersion: number,
  domains?: ModelDomainConnection | null,
  tokens?: ModelTokenConnection | null,
  roles?: ModelRoleConnection | null,
  chainMeta?: ChainMeta | null,
  createdAt: string,
  updatedAt: string,
  colonyNativeTokenId?: string | null,
  colonyNativeTokenName?: string | null,
};

export type Token = {
  __typename: "Token",
  internalId: string,
  contractAddress: string,
  name: string,
  symbol: string,
  decimals: number,
  type: TokenType,
  chainMeta?: ChainMeta | null,
  createdAt: string,
  updatedAt: string,
  userTokensId?: string | null,
  userTokensUsername?: string | null,
  colonyTokensId?: string | null,
  colonyTokensName?: string | null,
};

export enum TokenType {
  COLONY = "COLONY",
  ERC20 = "ERC20",
  SAI = "SAI",
}


export type ModelDomainConnection = {
  __typename: "ModelDomainConnection",
  items:  Array<Domain | null >,
  nextToken?: string | null,
};

export type Domain = {
  __typename: "Domain",
  internalId: string,
  chainId: number,
  chainMeta?: ChainMeta | null,
  createdAt: string,
  updatedAt: string,
  colonyDomainsId?: string | null,
  colonyDomainsName?: string | null,
};

export type ModelTokenConnection = {
  __typename: "ModelTokenConnection",
  items:  Array<Token | null >,
  nextToken?: string | null,
};

export type ModelRoleConnection = {
  __typename: "ModelRoleConnection",
  items:  Array<Role | null >,
  nextToken?: string | null,
};

export type Role = {
  __typename: "Role",
  internalId: string,
  type: RoleType,
  chainMeta?: ChainMeta | null,
  createdAt: string,
  updatedAt: string,
  colonyRolesId?: string | null,
  colonyRolesName?: string | null,
  colonyRoleRolesId?: string | null,
};

export enum RoleType {
  RECOVERY = "RECOVERY",
  ROOT = "ROOT",
  ARBITRATION = "ARBITRATION",
  ARCHITECTURE = "ARCHITECTURE",
  ARCHITECTURE_SUBDOMAIN_DEPRECATED = "ARCHITECTURE_SUBDOMAIN_DEPRECATED",
  FUNDING = "FUNDING",
  ADMINISTRATION = "ADMINISTRATION",
}


export type UpdateUserInput = {
  walletAddress: string,
  username: string,
  displayName?: string | null,
  avatarHash?: string | null,
};

export type DeleteUserInput = {
  walletAddress: string,
  username: string,
};

export type CreateColonyInput = {
  internalId: string,
  chainId: number,
  chain: number,
  contractAddress: string,
  name: string,
  displayName?: string | null,
  avatarHash?: string | null,
  chainVersion: number,
  colonyNativeTokenId?: string | null,
  colonyNativeTokenName?: string | null,
};

export type ModelColonyConditionInput = {
  internalId?: ModelIDInput | null,
  chainId?: ModelIntInput | null,
  chain?: ModelIntInput | null,
  displayName?: ModelStringInput | null,
  avatarHash?: ModelStringInput | null,
  chainVersion?: ModelIntInput | null,
  and?: Array< ModelColonyConditionInput | null > | null,
  or?: Array< ModelColonyConditionInput | null > | null,
  not?: ModelColonyConditionInput | null,
  colonyNativeTokenId?: ModelIDInput | null,
  colonyNativeTokenName?: ModelStringInput | null,
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

export type UpdateColonyInput = {
  internalId?: string | null,
  chainId?: number | null,
  chain?: number | null,
  contractAddress: string,
  name: string,
  displayName?: string | null,
  avatarHash?: string | null,
  chainVersion?: number | null,
  colonyNativeTokenId?: string | null,
  colonyNativeTokenName?: string | null,
};

export type DeleteColonyInput = {
  contractAddress: string,
  name: string,
};

export type CreateDomainInput = {
  internalId: string,
  chainId: number,
  colonyDomainsId?: string | null,
  colonyDomainsName?: string | null,
};

export type ModelDomainConditionInput = {
  and?: Array< ModelDomainConditionInput | null > | null,
  or?: Array< ModelDomainConditionInput | null > | null,
  not?: ModelDomainConditionInput | null,
  colonyDomainsId?: ModelIDInput | null,
  colonyDomainsName?: ModelStringInput | null,
};

export type UpdateDomainInput = {
  internalId: string,
  chainId: number,
  colonyDomainsId?: string | null,
  colonyDomainsName?: string | null,
};

export type DeleteDomainInput = {
  internalId: string,
  chainId: number,
};

export type CreateTokenInput = {
  internalId: string,
  contractAddress: string,
  name: string,
  symbol: string,
  decimals: number,
  type: TokenType,
  userTokensId?: string | null,
  userTokensUsername?: string | null,
  colonyTokensId?: string | null,
  colonyTokensName?: string | null,
};

export type ModelTokenConditionInput = {
  internalId?: ModelIDInput | null,
  symbol?: ModelStringInput | null,
  decimals?: ModelIntInput | null,
  type?: ModelTokenTypeInput | null,
  and?: Array< ModelTokenConditionInput | null > | null,
  or?: Array< ModelTokenConditionInput | null > | null,
  not?: ModelTokenConditionInput | null,
  userTokensId?: ModelIDInput | null,
  userTokensUsername?: ModelStringInput | null,
  colonyTokensId?: ModelIDInput | null,
  colonyTokensName?: ModelStringInput | null,
};

export type ModelTokenTypeInput = {
  eq?: TokenType | null,
  ne?: TokenType | null,
};

export type UpdateTokenInput = {
  internalId?: string | null,
  contractAddress: string,
  name: string,
  symbol?: string | null,
  decimals?: number | null,
  type?: TokenType | null,
  userTokensId?: string | null,
  userTokensUsername?: string | null,
  colonyTokensId?: string | null,
  colonyTokensName?: string | null,
};

export type DeleteTokenInput = {
  contractAddress: string,
  name: string,
};

export type CreateColonyRoleInput = {
  id?: string | null,
  colonyRoleColonyId?: string | null,
  colonyRoleColonyName?: string | null,
};

export type ModelColonyRoleConditionInput = {
  and?: Array< ModelColonyRoleConditionInput | null > | null,
  or?: Array< ModelColonyRoleConditionInput | null > | null,
  not?: ModelColonyRoleConditionInput | null,
  colonyRoleColonyId?: ModelIDInput | null,
  colonyRoleColonyName?: ModelStringInput | null,
};

export type UpdateColonyRoleInput = {
  id: string,
  colonyRoleColonyId?: string | null,
  colonyRoleColonyName?: string | null,
};

export type DeleteColonyRoleInput = {
  id: string,
};

export type CreateRoleInput = {
  internalId: string,
  type: RoleType,
  colonyRolesId?: string | null,
  colonyRolesName?: string | null,
  colonyRoleRolesId?: string | null,
};

export type ModelRoleConditionInput = {
  type?: ModelRoleTypeInput | null,
  and?: Array< ModelRoleConditionInput | null > | null,
  or?: Array< ModelRoleConditionInput | null > | null,
  not?: ModelRoleConditionInput | null,
  colonyRolesId?: ModelIDInput | null,
  colonyRolesName?: ModelStringInput | null,
  colonyRoleRolesId?: ModelIDInput | null,
};

export type ModelRoleTypeInput = {
  eq?: RoleType | null,
  ne?: RoleType | null,
};

export type UpdateRoleInput = {
  internalId: string,
  type?: RoleType | null,
  colonyRolesId?: string | null,
  colonyRolesName?: string | null,
  colonyRoleRolesId?: string | null,
};

export type DeleteRoleInput = {
  internalId: string,
};

export type ModelChainMetaFilterInput = {
  confirmedOnChain?: ModelBooleanInput | null,
  and?: Array< ModelChainMetaFilterInput | null > | null,
  or?: Array< ModelChainMetaFilterInput | null > | null,
  not?: ModelChainMetaFilterInput | null,
};

export type ModelChainMetaConnection = {
  __typename: "ModelChainMetaConnection",
  items:  Array<ChainMeta | null >,
  nextToken?: string | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelUserFilterInput = {
  walletAddress?: ModelStringInput | null,
  username?: ModelStringInput | null,
  displayName?: ModelStringInput | null,
  avatarHash?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelColonyFilterInput = {
  internalId?: ModelIDInput | null,
  chainId?: ModelIntInput | null,
  chain?: ModelIntInput | null,
  contractAddress?: ModelStringInput | null,
  name?: ModelStringInput | null,
  displayName?: ModelStringInput | null,
  avatarHash?: ModelStringInput | null,
  chainVersion?: ModelIntInput | null,
  and?: Array< ModelColonyFilterInput | null > | null,
  or?: Array< ModelColonyFilterInput | null > | null,
  not?: ModelColonyFilterInput | null,
  colonyNativeTokenId?: ModelIDInput | null,
  colonyNativeTokenName?: ModelStringInput | null,
};

export type ModelColonyConnection = {
  __typename: "ModelColonyConnection",
  items:  Array<Colony | null >,
  nextToken?: string | null,
};

export type ModelIntKeyConditionInput = {
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelDomainFilterInput = {
  internalId?: ModelIDInput | null,
  chainId?: ModelIntInput | null,
  and?: Array< ModelDomainFilterInput | null > | null,
  or?: Array< ModelDomainFilterInput | null > | null,
  not?: ModelDomainFilterInput | null,
  colonyDomainsId?: ModelIDInput | null,
  colonyDomainsName?: ModelStringInput | null,
};

export type ModelTokenFilterInput = {
  internalId?: ModelIDInput | null,
  contractAddress?: ModelStringInput | null,
  name?: ModelStringInput | null,
  symbol?: ModelStringInput | null,
  decimals?: ModelIntInput | null,
  type?: ModelTokenTypeInput | null,
  and?: Array< ModelTokenFilterInput | null > | null,
  or?: Array< ModelTokenFilterInput | null > | null,
  not?: ModelTokenFilterInput | null,
  userTokensId?: ModelIDInput | null,
  userTokensUsername?: ModelStringInput | null,
  colonyTokensId?: ModelIDInput | null,
  colonyTokensName?: ModelStringInput | null,
};

export type ModelColonyRoleFilterInput = {
  and?: Array< ModelColonyRoleFilterInput | null > | null,
  or?: Array< ModelColonyRoleFilterInput | null > | null,
  not?: ModelColonyRoleFilterInput | null,
  colonyRoleColonyId?: ModelIDInput | null,
  colonyRoleColonyName?: ModelStringInput | null,
};

export type ModelColonyRoleConnection = {
  __typename: "ModelColonyRoleConnection",
  items:  Array<ColonyRole | null >,
  nextToken?: string | null,
};

export type ModelRoleFilterInput = {
  internalId?: ModelIDInput | null,
  type?: ModelRoleTypeInput | null,
  and?: Array< ModelRoleFilterInput | null > | null,
  or?: Array< ModelRoleFilterInput | null > | null,
  not?: ModelRoleFilterInput | null,
  colonyRolesId?: ModelIDInput | null,
  colonyRolesName?: ModelStringInput | null,
  colonyRoleRolesId?: ModelIDInput | null,
};

export type ModelSubscriptionChainMetaFilterInput = {
  confirmedOnChain?: ModelSubscriptionBooleanInput | null,
  and?: Array< ModelSubscriptionChainMetaFilterInput | null > | null,
  or?: Array< ModelSubscriptionChainMetaFilterInput | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionUserFilterInput = {
  walletAddress?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionStringInput | null,
  displayName?: ModelSubscriptionStringInput | null,
  avatarHash?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
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

export type ModelSubscriptionColonyFilterInput = {
  internalId?: ModelSubscriptionIDInput | null,
  chainId?: ModelSubscriptionIntInput | null,
  chain?: ModelSubscriptionIntInput | null,
  contractAddress?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  displayName?: ModelSubscriptionStringInput | null,
  avatarHash?: ModelSubscriptionStringInput | null,
  chainVersion?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionColonyFilterInput | null > | null,
  or?: Array< ModelSubscriptionColonyFilterInput | null > | null,
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

export type ModelSubscriptionDomainFilterInput = {
  internalId?: ModelSubscriptionIDInput | null,
  chainId?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionDomainFilterInput | null > | null,
  or?: Array< ModelSubscriptionDomainFilterInput | null > | null,
};

export type ModelSubscriptionTokenFilterInput = {
  internalId?: ModelSubscriptionIDInput | null,
  contractAddress?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  symbol?: ModelSubscriptionStringInput | null,
  decimals?: ModelSubscriptionIntInput | null,
  type?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTokenFilterInput | null > | null,
  or?: Array< ModelSubscriptionTokenFilterInput | null > | null,
};

export type ModelSubscriptionColonyRoleFilterInput = {
  and?: Array< ModelSubscriptionColonyRoleFilterInput | null > | null,
  or?: Array< ModelSubscriptionColonyRoleFilterInput | null > | null,
};

export type ModelSubscriptionRoleFilterInput = {
  internalId?: ModelSubscriptionIDInput | null,
  type?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionRoleFilterInput | null > | null,
  or?: Array< ModelSubscriptionRoleFilterInput | null > | null,
};

export type CreateChainMetaMutationVariables = {
  input: CreateChainMetaInput,
  condition?: ModelChainMetaConditionInput | null,
};

export type CreateChainMetaMutation = {
  createChainMeta?:  {
    __typename: "ChainMeta",
    confirmedOnChain: boolean,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateChainMetaMutationVariables = {
  input: UpdateChainMetaInput,
  condition?: ModelChainMetaConditionInput | null,
};

export type UpdateChainMetaMutation = {
  updateChainMeta?:  {
    __typename: "ChainMeta",
    confirmedOnChain: boolean,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteChainMetaMutationVariables = {
  input: DeleteChainMetaInput,
  condition?: ModelChainMetaConditionInput | null,
};

export type DeleteChainMetaMutation = {
  deleteChainMeta?:  {
    __typename: "ChainMeta",
    confirmedOnChain: boolean,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    walletAddress: string,
    username: string,
    displayName?: string | null,
    avatarHash?: string | null,
    roles?:  Array< {
      __typename: "ColonyRole",
      id: string,
      createdAt: string,
      updatedAt: string,
      colonyRoleColonyId?: string | null,
      colonyRoleColonyName?: string | null,
    } | null > | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
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
    walletAddress: string,
    username: string,
    displayName?: string | null,
    avatarHash?: string | null,
    roles?:  Array< {
      __typename: "ColonyRole",
      id: string,
      createdAt: string,
      updatedAt: string,
      colonyRoleColonyId?: string | null,
      colonyRoleColonyName?: string | null,
    } | null > | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
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
    walletAddress: string,
    username: string,
    displayName?: string | null,
    avatarHash?: string | null,
    roles?:  Array< {
      __typename: "ColonyRole",
      id: string,
      createdAt: string,
      updatedAt: string,
      colonyRoleColonyId?: string | null,
      colonyRoleColonyName?: string | null,
    } | null > | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
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
    internalId: string,
    chainId: number,
    chain: number,
    contractAddress: string,
    name: string,
    displayName?: string | null,
    avatarHash?: string | null,
    nativeToken?:  {
      __typename: "Token",
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null,
    chainVersion: number,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId?: string | null,
    colonyNativeTokenName?: string | null,
  } | null,
};

export type UpdateColonyMutationVariables = {
  input: UpdateColonyInput,
  condition?: ModelColonyConditionInput | null,
};

export type UpdateColonyMutation = {
  updateColony?:  {
    __typename: "Colony",
    internalId: string,
    chainId: number,
    chain: number,
    contractAddress: string,
    name: string,
    displayName?: string | null,
    avatarHash?: string | null,
    nativeToken?:  {
      __typename: "Token",
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null,
    chainVersion: number,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId?: string | null,
    colonyNativeTokenName?: string | null,
  } | null,
};

export type DeleteColonyMutationVariables = {
  input: DeleteColonyInput,
  condition?: ModelColonyConditionInput | null,
};

export type DeleteColonyMutation = {
  deleteColony?:  {
    __typename: "Colony",
    internalId: string,
    chainId: number,
    chain: number,
    contractAddress: string,
    name: string,
    displayName?: string | null,
    avatarHash?: string | null,
    nativeToken?:  {
      __typename: "Token",
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null,
    chainVersion: number,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId?: string | null,
    colonyNativeTokenName?: string | null,
  } | null,
};

export type CreateDomainMutationVariables = {
  input: CreateDomainInput,
  condition?: ModelDomainConditionInput | null,
};

export type CreateDomainMutation = {
  createDomain?:  {
    __typename: "Domain",
    internalId: string,
    chainId: number,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    colonyDomainsName?: string | null,
  } | null,
};

export type UpdateDomainMutationVariables = {
  input: UpdateDomainInput,
  condition?: ModelDomainConditionInput | null,
};

export type UpdateDomainMutation = {
  updateDomain?:  {
    __typename: "Domain",
    internalId: string,
    chainId: number,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    colonyDomainsName?: string | null,
  } | null,
};

export type DeleteDomainMutationVariables = {
  input: DeleteDomainInput,
  condition?: ModelDomainConditionInput | null,
};

export type DeleteDomainMutation = {
  deleteDomain?:  {
    __typename: "Domain",
    internalId: string,
    chainId: number,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    colonyDomainsName?: string | null,
  } | null,
};

export type CreateTokenMutationVariables = {
  input: CreateTokenInput,
  condition?: ModelTokenConditionInput | null,
};

export type CreateTokenMutation = {
  createToken?:  {
    __typename: "Token",
    internalId: string,
    contractAddress: string,
    name: string,
    symbol: string,
    decimals: number,
    type: TokenType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    userTokensId?: string | null,
    userTokensUsername?: string | null,
    colonyTokensId?: string | null,
    colonyTokensName?: string | null,
  } | null,
};

export type UpdateTokenMutationVariables = {
  input: UpdateTokenInput,
  condition?: ModelTokenConditionInput | null,
};

export type UpdateTokenMutation = {
  updateToken?:  {
    __typename: "Token",
    internalId: string,
    contractAddress: string,
    name: string,
    symbol: string,
    decimals: number,
    type: TokenType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    userTokensId?: string | null,
    userTokensUsername?: string | null,
    colonyTokensId?: string | null,
    colonyTokensName?: string | null,
  } | null,
};

export type DeleteTokenMutationVariables = {
  input: DeleteTokenInput,
  condition?: ModelTokenConditionInput | null,
};

export type DeleteTokenMutation = {
  deleteToken?:  {
    __typename: "Token",
    internalId: string,
    contractAddress: string,
    name: string,
    symbol: string,
    decimals: number,
    type: TokenType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    userTokensId?: string | null,
    userTokensUsername?: string | null,
    colonyTokensId?: string | null,
    colonyTokensName?: string | null,
  } | null,
};

export type CreateColonyRoleMutationVariables = {
  input: CreateColonyRoleInput,
  condition?: ModelColonyRoleConditionInput | null,
};

export type CreateColonyRoleMutation = {
  createColonyRole?:  {
    __typename: "ColonyRole",
    colony?:  {
      __typename: "Colony",
      internalId: string,
      chainId: number,
      chain: number,
      contractAddress: string,
      name: string,
      displayName?: string | null,
      avatarHash?: string | null,
      chainVersion: number,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId?: string | null,
      colonyNativeTokenName?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
    colonyRoleColonyId?: string | null,
    colonyRoleColonyName?: string | null,
  } | null,
};

export type UpdateColonyRoleMutationVariables = {
  input: UpdateColonyRoleInput,
  condition?: ModelColonyRoleConditionInput | null,
};

export type UpdateColonyRoleMutation = {
  updateColonyRole?:  {
    __typename: "ColonyRole",
    colony?:  {
      __typename: "Colony",
      internalId: string,
      chainId: number,
      chain: number,
      contractAddress: string,
      name: string,
      displayName?: string | null,
      avatarHash?: string | null,
      chainVersion: number,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId?: string | null,
      colonyNativeTokenName?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
    colonyRoleColonyId?: string | null,
    colonyRoleColonyName?: string | null,
  } | null,
};

export type DeleteColonyRoleMutationVariables = {
  input: DeleteColonyRoleInput,
  condition?: ModelColonyRoleConditionInput | null,
};

export type DeleteColonyRoleMutation = {
  deleteColonyRole?:  {
    __typename: "ColonyRole",
    colony?:  {
      __typename: "Colony",
      internalId: string,
      chainId: number,
      chain: number,
      contractAddress: string,
      name: string,
      displayName?: string | null,
      avatarHash?: string | null,
      chainVersion: number,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId?: string | null,
      colonyNativeTokenName?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
    colonyRoleColonyId?: string | null,
    colonyRoleColonyName?: string | null,
  } | null,
};

export type CreateRoleMutationVariables = {
  input: CreateRoleInput,
  condition?: ModelRoleConditionInput | null,
};

export type CreateRoleMutation = {
  createRole?:  {
    __typename: "Role",
    internalId: string,
    type: RoleType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyRolesId?: string | null,
    colonyRolesName?: string | null,
    colonyRoleRolesId?: string | null,
  } | null,
};

export type UpdateRoleMutationVariables = {
  input: UpdateRoleInput,
  condition?: ModelRoleConditionInput | null,
};

export type UpdateRoleMutation = {
  updateRole?:  {
    __typename: "Role",
    internalId: string,
    type: RoleType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyRolesId?: string | null,
    colonyRolesName?: string | null,
    colonyRoleRolesId?: string | null,
  } | null,
};

export type DeleteRoleMutationVariables = {
  input: DeleteRoleInput,
  condition?: ModelRoleConditionInput | null,
};

export type DeleteRoleMutation = {
  deleteRole?:  {
    __typename: "Role",
    internalId: string,
    type: RoleType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyRolesId?: string | null,
    colonyRolesName?: string | null,
    colonyRoleRolesId?: string | null,
  } | null,
};

export type GetChainMetaQueryVariables = {
  id: string,
};

export type GetChainMetaQuery = {
  getChainMeta?:  {
    __typename: "ChainMeta",
    confirmedOnChain: boolean,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListChainMetasQueryVariables = {
  filter?: ModelChainMetaFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChainMetasQuery = {
  listChainMetas?:  {
    __typename: "ModelChainMetaConnection",
    items:  Array< {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  walletAddress: string,
  username: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    walletAddress: string,
    username: string,
    displayName?: string | null,
    avatarHash?: string | null,
    roles?:  Array< {
      __typename: "ColonyRole",
      id: string,
      createdAt: string,
      updatedAt: string,
      colonyRoleColonyId?: string | null,
      colonyRoleColonyName?: string | null,
    } | null > | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  walletAddress?: string | null,
  username?: ModelStringKeyConditionInput | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      walletAddress: string,
      username: string,
      displayName?: string | null,
      avatarHash?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetColonyQueryVariables = {
  contractAddress: string,
  name: string,
};

export type GetColonyQuery = {
  getColony?:  {
    __typename: "Colony",
    internalId: string,
    chainId: number,
    chain: number,
    contractAddress: string,
    name: string,
    displayName?: string | null,
    avatarHash?: string | null,
    nativeToken?:  {
      __typename: "Token",
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null,
    chainVersion: number,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId?: string | null,
    colonyNativeTokenName?: string | null,
  } | null,
};

export type ListColoniesQueryVariables = {
  contractAddress?: string | null,
  name?: ModelStringKeyConditionInput | null,
  filter?: ModelColonyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListColoniesQuery = {
  listColonies?:  {
    __typename: "ModelColonyConnection",
    items:  Array< {
      __typename: "Colony",
      internalId: string,
      chainId: number,
      chain: number,
      contractAddress: string,
      name: string,
      displayName?: string | null,
      avatarHash?: string | null,
      chainVersion: number,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId?: string | null,
      colonyNativeTokenName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetDomainQueryVariables = {
  internalId: string,
  chainId: number,
};

export type GetDomainQuery = {
  getDomain?:  {
    __typename: "Domain",
    internalId: string,
    chainId: number,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    colonyDomainsName?: string | null,
  } | null,
};

export type ListDomainsQueryVariables = {
  internalId?: string | null,
  chainId?: ModelIntKeyConditionInput | null,
  filter?: ModelDomainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListDomainsQuery = {
  listDomains?:  {
    __typename: "ModelDomainConnection",
    items:  Array< {
      __typename: "Domain",
      internalId: string,
      chainId: number,
      createdAt: string,
      updatedAt: string,
      colonyDomainsId?: string | null,
      colonyDomainsName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTokenQueryVariables = {
  contractAddress: string,
  name: string,
};

export type GetTokenQuery = {
  getToken?:  {
    __typename: "Token",
    internalId: string,
    contractAddress: string,
    name: string,
    symbol: string,
    decimals: number,
    type: TokenType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    userTokensId?: string | null,
    userTokensUsername?: string | null,
    colonyTokensId?: string | null,
    colonyTokensName?: string | null,
  } | null,
};

export type ListTokensQueryVariables = {
  contractAddress?: string | null,
  name?: ModelStringKeyConditionInput | null,
  filter?: ModelTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListTokensQuery = {
  listTokens?:  {
    __typename: "ModelTokenConnection",
    items:  Array< {
      __typename: "Token",
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetColonyRoleQueryVariables = {
  id: string,
};

export type GetColonyRoleQuery = {
  getColonyRole?:  {
    __typename: "ColonyRole",
    colony?:  {
      __typename: "Colony",
      internalId: string,
      chainId: number,
      chain: number,
      contractAddress: string,
      name: string,
      displayName?: string | null,
      avatarHash?: string | null,
      chainVersion: number,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId?: string | null,
      colonyNativeTokenName?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
    colonyRoleColonyId?: string | null,
    colonyRoleColonyName?: string | null,
  } | null,
};

export type ListColonyRolesQueryVariables = {
  filter?: ModelColonyRoleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListColonyRolesQuery = {
  listColonyRoles?:  {
    __typename: "ModelColonyRoleConnection",
    items:  Array< {
      __typename: "ColonyRole",
      id: string,
      createdAt: string,
      updatedAt: string,
      colonyRoleColonyId?: string | null,
      colonyRoleColonyName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetRoleQueryVariables = {
  internalId: string,
};

export type GetRoleQuery = {
  getRole?:  {
    __typename: "Role",
    internalId: string,
    type: RoleType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyRolesId?: string | null,
    colonyRolesName?: string | null,
    colonyRoleRolesId?: string | null,
  } | null,
};

export type ListRolesQueryVariables = {
  internalId?: string | null,
  filter?: ModelRoleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListRolesQuery = {
  listRoles?:  {
    __typename: "ModelRoleConnection",
    items:  Array< {
      __typename: "Role",
      internalId: string,
      type: RoleType,
      createdAt: string,
      updatedAt: string,
      colonyRolesId?: string | null,
      colonyRolesName?: string | null,
      colonyRoleRolesId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserByAddressQueryVariables = {
  walletAddress: string,
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
      walletAddress: string,
      username: string,
      displayName?: string | null,
      avatarHash?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserByUsernameQueryVariables = {
  username: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetUserByUsernameQuery = {
  getUserByUsername?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      walletAddress: string,
      username: string,
      displayName?: string | null,
      avatarHash?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetColonyByAddressQueryVariables = {
  contractAddress: string,
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
      internalId: string,
      chainId: number,
      chain: number,
      contractAddress: string,
      name: string,
      displayName?: string | null,
      avatarHash?: string | null,
      chainVersion: number,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId?: string | null,
      colonyNativeTokenName?: string | null,
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
      internalId: string,
      chainId: number,
      chain: number,
      contractAddress: string,
      name: string,
      displayName?: string | null,
      avatarHash?: string | null,
      chainVersion: number,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId?: string | null,
      colonyNativeTokenName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTokenByAddressQueryVariables = {
  contractAddress: string,
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
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTokensByNameQueryVariables = {
  name: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetTokensByNameQuery = {
  getTokensByName?:  {
    __typename: "ModelTokenConnection",
    items:  Array< {
      __typename: "Token",
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTokensBySymbolQueryVariables = {
  symbol: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetTokensBySymbolQuery = {
  getTokensBySymbol?:  {
    __typename: "ModelTokenConnection",
    items:  Array< {
      __typename: "Token",
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
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
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetRolesByTypeQueryVariables = {
  type: RoleType,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelRoleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetRolesByTypeQuery = {
  getRolesByType?:  {
    __typename: "ModelRoleConnection",
    items:  Array< {
      __typename: "Role",
      internalId: string,
      type: RoleType,
      createdAt: string,
      updatedAt: string,
      colonyRolesId?: string | null,
      colonyRolesName?: string | null,
      colonyRoleRolesId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateChainMetaSubscriptionVariables = {
  filter?: ModelSubscriptionChainMetaFilterInput | null,
};

export type OnCreateChainMetaSubscription = {
  onCreateChainMeta?:  {
    __typename: "ChainMeta",
    confirmedOnChain: boolean,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateChainMetaSubscriptionVariables = {
  filter?: ModelSubscriptionChainMetaFilterInput | null,
};

export type OnUpdateChainMetaSubscription = {
  onUpdateChainMeta?:  {
    __typename: "ChainMeta",
    confirmedOnChain: boolean,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteChainMetaSubscriptionVariables = {
  filter?: ModelSubscriptionChainMetaFilterInput | null,
};

export type OnDeleteChainMetaSubscription = {
  onDeleteChainMeta?:  {
    __typename: "ChainMeta",
    confirmedOnChain: boolean,
    id: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    walletAddress: string,
    username: string,
    displayName?: string | null,
    avatarHash?: string | null,
    roles?:  Array< {
      __typename: "ColonyRole",
      id: string,
      createdAt: string,
      updatedAt: string,
      colonyRoleColonyId?: string | null,
      colonyRoleColonyName?: string | null,
    } | null > | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
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
    walletAddress: string,
    username: string,
    displayName?: string | null,
    avatarHash?: string | null,
    roles?:  Array< {
      __typename: "ColonyRole",
      id: string,
      createdAt: string,
      updatedAt: string,
      colonyRoleColonyId?: string | null,
      colonyRoleColonyName?: string | null,
    } | null > | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
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
    walletAddress: string,
    username: string,
    displayName?: string | null,
    avatarHash?: string | null,
    roles?:  Array< {
      __typename: "ColonyRole",
      id: string,
      createdAt: string,
      updatedAt: string,
      colonyRoleColonyId?: string | null,
      colonyRoleColonyName?: string | null,
    } | null > | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
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
    internalId: string,
    chainId: number,
    chain: number,
    contractAddress: string,
    name: string,
    displayName?: string | null,
    avatarHash?: string | null,
    nativeToken?:  {
      __typename: "Token",
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null,
    chainVersion: number,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId?: string | null,
    colonyNativeTokenName?: string | null,
  } | null,
};

export type OnUpdateColonySubscriptionVariables = {
  filter?: ModelSubscriptionColonyFilterInput | null,
};

export type OnUpdateColonySubscription = {
  onUpdateColony?:  {
    __typename: "Colony",
    internalId: string,
    chainId: number,
    chain: number,
    contractAddress: string,
    name: string,
    displayName?: string | null,
    avatarHash?: string | null,
    nativeToken?:  {
      __typename: "Token",
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null,
    chainVersion: number,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId?: string | null,
    colonyNativeTokenName?: string | null,
  } | null,
};

export type OnDeleteColonySubscriptionVariables = {
  filter?: ModelSubscriptionColonyFilterInput | null,
};

export type OnDeleteColonySubscription = {
  onDeleteColony?:  {
    __typename: "Colony",
    internalId: string,
    chainId: number,
    chain: number,
    contractAddress: string,
    name: string,
    displayName?: string | null,
    avatarHash?: string | null,
    nativeToken?:  {
      __typename: "Token",
      internalId: string,
      contractAddress: string,
      name: string,
      symbol: string,
      decimals: number,
      type: TokenType,
      createdAt: string,
      updatedAt: string,
      userTokensId?: string | null,
      userTokensUsername?: string | null,
      colonyTokensId?: string | null,
      colonyTokensName?: string | null,
    } | null,
    chainVersion: number,
    domains?:  {
      __typename: "ModelDomainConnection",
      nextToken?: string | null,
    } | null,
    tokens?:  {
      __typename: "ModelTokenConnection",
      nextToken?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId?: string | null,
    colonyNativeTokenName?: string | null,
  } | null,
};

export type OnCreateDomainSubscriptionVariables = {
  filter?: ModelSubscriptionDomainFilterInput | null,
};

export type OnCreateDomainSubscription = {
  onCreateDomain?:  {
    __typename: "Domain",
    internalId: string,
    chainId: number,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    colonyDomainsName?: string | null,
  } | null,
};

export type OnUpdateDomainSubscriptionVariables = {
  filter?: ModelSubscriptionDomainFilterInput | null,
};

export type OnUpdateDomainSubscription = {
  onUpdateDomain?:  {
    __typename: "Domain",
    internalId: string,
    chainId: number,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    colonyDomainsName?: string | null,
  } | null,
};

export type OnDeleteDomainSubscriptionVariables = {
  filter?: ModelSubscriptionDomainFilterInput | null,
};

export type OnDeleteDomainSubscription = {
  onDeleteDomain?:  {
    __typename: "Domain",
    internalId: string,
    chainId: number,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyDomainsId?: string | null,
    colonyDomainsName?: string | null,
  } | null,
};

export type OnCreateTokenSubscriptionVariables = {
  filter?: ModelSubscriptionTokenFilterInput | null,
};

export type OnCreateTokenSubscription = {
  onCreateToken?:  {
    __typename: "Token",
    internalId: string,
    contractAddress: string,
    name: string,
    symbol: string,
    decimals: number,
    type: TokenType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    userTokensId?: string | null,
    userTokensUsername?: string | null,
    colonyTokensId?: string | null,
    colonyTokensName?: string | null,
  } | null,
};

export type OnUpdateTokenSubscriptionVariables = {
  filter?: ModelSubscriptionTokenFilterInput | null,
};

export type OnUpdateTokenSubscription = {
  onUpdateToken?:  {
    __typename: "Token",
    internalId: string,
    contractAddress: string,
    name: string,
    symbol: string,
    decimals: number,
    type: TokenType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    userTokensId?: string | null,
    userTokensUsername?: string | null,
    colonyTokensId?: string | null,
    colonyTokensName?: string | null,
  } | null,
};

export type OnDeleteTokenSubscriptionVariables = {
  filter?: ModelSubscriptionTokenFilterInput | null,
};

export type OnDeleteTokenSubscription = {
  onDeleteToken?:  {
    __typename: "Token",
    internalId: string,
    contractAddress: string,
    name: string,
    symbol: string,
    decimals: number,
    type: TokenType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    userTokensId?: string | null,
    userTokensUsername?: string | null,
    colonyTokensId?: string | null,
    colonyTokensName?: string | null,
  } | null,
};

export type OnCreateColonyRoleSubscriptionVariables = {
  filter?: ModelSubscriptionColonyRoleFilterInput | null,
};

export type OnCreateColonyRoleSubscription = {
  onCreateColonyRole?:  {
    __typename: "ColonyRole",
    colony?:  {
      __typename: "Colony",
      internalId: string,
      chainId: number,
      chain: number,
      contractAddress: string,
      name: string,
      displayName?: string | null,
      avatarHash?: string | null,
      chainVersion: number,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId?: string | null,
      colonyNativeTokenName?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
    colonyRoleColonyId?: string | null,
    colonyRoleColonyName?: string | null,
  } | null,
};

export type OnUpdateColonyRoleSubscriptionVariables = {
  filter?: ModelSubscriptionColonyRoleFilterInput | null,
};

export type OnUpdateColonyRoleSubscription = {
  onUpdateColonyRole?:  {
    __typename: "ColonyRole",
    colony?:  {
      __typename: "Colony",
      internalId: string,
      chainId: number,
      chain: number,
      contractAddress: string,
      name: string,
      displayName?: string | null,
      avatarHash?: string | null,
      chainVersion: number,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId?: string | null,
      colonyNativeTokenName?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
    colonyRoleColonyId?: string | null,
    colonyRoleColonyName?: string | null,
  } | null,
};

export type OnDeleteColonyRoleSubscriptionVariables = {
  filter?: ModelSubscriptionColonyRoleFilterInput | null,
};

export type OnDeleteColonyRoleSubscription = {
  onDeleteColonyRole?:  {
    __typename: "ColonyRole",
    colony?:  {
      __typename: "Colony",
      internalId: string,
      chainId: number,
      chain: number,
      contractAddress: string,
      name: string,
      displayName?: string | null,
      avatarHash?: string | null,
      chainVersion: number,
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId?: string | null,
      colonyNativeTokenName?: string | null,
    } | null,
    roles?:  {
      __typename: "ModelRoleConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    createdAt: string,
    updatedAt: string,
    colonyRoleColonyId?: string | null,
    colonyRoleColonyName?: string | null,
  } | null,
};

export type OnCreateRoleSubscriptionVariables = {
  filter?: ModelSubscriptionRoleFilterInput | null,
};

export type OnCreateRoleSubscription = {
  onCreateRole?:  {
    __typename: "Role",
    internalId: string,
    type: RoleType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyRolesId?: string | null,
    colonyRolesName?: string | null,
    colonyRoleRolesId?: string | null,
  } | null,
};

export type OnUpdateRoleSubscriptionVariables = {
  filter?: ModelSubscriptionRoleFilterInput | null,
};

export type OnUpdateRoleSubscription = {
  onUpdateRole?:  {
    __typename: "Role",
    internalId: string,
    type: RoleType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyRolesId?: string | null,
    colonyRolesName?: string | null,
    colonyRoleRolesId?: string | null,
  } | null,
};

export type OnDeleteRoleSubscriptionVariables = {
  filter?: ModelSubscriptionRoleFilterInput | null,
};

export type OnDeleteRoleSubscription = {
  onDeleteRole?:  {
    __typename: "Role",
    internalId: string,
    type: RoleType,
    chainMeta?:  {
      __typename: "ChainMeta",
      confirmedOnChain: boolean,
      id: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    colonyRolesId?: string | null,
    colonyRolesName?: string | null,
    colonyRoleRolesId?: string | null,
  } | null,
};
