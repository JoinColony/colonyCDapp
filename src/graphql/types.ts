/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export enum TokenType {
  COLONY = "COLONY",
  ERC20 = "ERC20",
}


export type Token = {
  __typename: "Token",
  id: string,
  name: string,
  symbol: string,
  decimals: number,
  type?: TokenType | null,
  colonies?: ModelColonyTokensConnection | null,
  createdAt: string,
  updatedAt: string,
};

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

export type Colony = {
  __typename: "Colony",
  id: string,
  name: string,
  nativeToken: Token,
  tokens?: ModelColonyTokensConnection | null,
  createdAt: string,
  updatedAt: string,
  colonyNativeTokenId: string,
};

export type CreateTokenInput = {
  id?: string | null,
  name: string,
  symbol: string,
  decimals: number,
  type?: TokenType | null,
};

export type ModelTokenConditionInput = {
  name?: ModelStringInput | null,
  symbol?: ModelStringInput | null,
  decimals?: ModelIntInput | null,
  type?: ModelTokenTypeInput | null,
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
};

export type DeleteTokenInput = {
  id: string,
};

export type CreateColonyInput = {
  id?: string | null,
  name: string,
  colonyNativeTokenId: string,
};

export type ModelColonyConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelColonyConditionInput | null > | null,
  or?: Array< ModelColonyConditionInput | null > | null,
  not?: ModelColonyConditionInput | null,
  colonyNativeTokenId?: ModelIDInput | null,
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
  colonyNativeTokenId: string,
};

export type DeleteColonyInput = {
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

export type TokenFromEverywhereArguments = {
  tokenAddress: string,
};

export type TokenFromEverywhereReturn = {
  __typename: "TokenFromEverywhereReturn",
  items?:  Array<Token | null > | null,
};

export type ModelTokenFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  symbol?: ModelStringInput | null,
  decimals?: ModelIntInput | null,
  type?: ModelTokenTypeInput | null,
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
  and?: Array< ModelColonyFilterInput | null > | null,
  or?: Array< ModelColonyFilterInput | null > | null,
  not?: ModelColonyFilterInput | null,
  colonyNativeTokenId?: ModelIDInput | null,
};

export type ModelColonyConnection = {
  __typename: "ModelColonyConnection",
  items:  Array<Colony | null >,
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

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type CreateColonyWithTokenMutationVariables = {
  colonyAddress: string,
  colonyName: string,
  tokenAddress: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals?: number | null,
  tokenType?: TokenType | null,
};

export type CreateColonyWithTokenMutation = {
  createToken?:  {
    __typename: "Token",
    id: string,
  } | null,
  createColony?:  {
    __typename: "Colony",
    id: string,
  } | null,
  createColonyTokens?:  {
    __typename: "ColonyTokens",
    id: string,
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
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
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
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
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
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
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
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    } | null >,
    nextToken?: string | null,
  } | null,
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
    createdAt: string,
    updatedAt: string,
  } | null,
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
    createdAt: string,
    updatedAt: string,
  } | null,
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
    createdAt: string,
    updatedAt: string,
  } | null,
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
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
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
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
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
    createdAt: string,
    updatedAt: string,
    colonyNativeTokenId: string,
  } | null,
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
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
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
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
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
      createdAt: string,
      updatedAt: string,
      colonyNativeTokenId: string,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};
