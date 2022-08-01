/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

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

export type User = {
  __typename: "User",
  walletAddress: string,
  username: string,
  displayName?: string | null,
  avatarHash?: string | null,
  createdAt: string,
  updatedAt: string,
};

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
    createdAt: string,
    updatedAt: string,
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

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    walletAddress: string,
    username: string,
    displayName?: string | null,
    avatarHash?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    walletAddress: string,
    username: string,
    displayName?: string | null,
    avatarHash?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    walletAddress: string,
    username: string,
    displayName?: string | null,
    avatarHash?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
