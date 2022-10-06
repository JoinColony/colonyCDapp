/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTokenFromEverywhere = /* GraphQL */ `
  query GetTokenFromEverywhere($input: TokenFromEverywhereArguments) {
    getTokenFromEverywhere(input: $input) {
      items {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
    }
  }
`;
export const getToken = /* GraphQL */ `
  query GetToken($id: ID!) {
    getToken(id: $id) {
      id
      name
      symbol
      decimals
      type
      colonies {
        nextToken
      }
      users {
        nextToken
      }
      status {
        unlocked
        canMint
        canUnlock
        recovery
        deploymentFinished
      }
      createdAt
      updatedAt
    }
  }
`;
export const listTokens = /* GraphQL */ `
  query ListTokens(
    $filter: ModelTokenFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTokens(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getColony = /* GraphQL */ `
  query GetColony($id: ID!) {
    getColony(id: $id) {
      id
      name
      nativeToken {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      tokens {
        nextToken
      }
      profile {
        avatar
        thumbnail
        displayName
        bio
        location
        website
      }
      status {
        unlocked
        canMint
        canUnlock
        recovery
        deploymentFinished
      }
      createdAt
      updatedAt
      colonyNativeTokenId
    }
  }
`;
export const listColonies = /* GraphQL */ `
  query ListColonies(
    $filter: ModelColonyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listColonies(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      tokens {
        nextToken
      }
      profile {
        avatar
        thumbnail
        displayName
        bio
        location
        website
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getColonyTokens = /* GraphQL */ `
  query GetColonyTokens($id: ID!) {
    getColonyTokens(id: $id) {
      id
      tokenID
      colonyID
      token {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      colony {
        id
        name
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      createdAt
      updatedAt
    }
  }
`;
export const listColonyTokens = /* GraphQL */ `
  query ListColonyTokens(
    $filter: ModelColonyTokensFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listColonyTokens(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tokenID
        colonyID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserTokens = /* GraphQL */ `
  query GetUserTokens($id: ID!) {
    getUserTokens(id: $id) {
      id
      tokenID
      userID
      token {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      user {
        id
        name
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUserTokens = /* GraphQL */ `
  query ListUserTokens(
    $filter: ModelUserTokensFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserTokens(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tokenID
        userID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTokenByAddress = /* GraphQL */ `
  query GetTokenByAddress(
    $id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTokenFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTokenByAddress(
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTokensByType = /* GraphQL */ `
  query GetTokensByType(
    $type: TokenType!
    $sortDirection: ModelSortDirection
    $filter: ModelTokenFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTokensByType(
      type: $type
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getColonyByAddress = /* GraphQL */ `
  query GetColonyByAddress(
    $id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelColonyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getColonyByAddress(
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      nextToken
    }
  }
`;
export const getColonyByName = /* GraphQL */ `
  query GetColonyByName(
    $name: String!
    $sortDirection: ModelSortDirection
    $filter: ModelColonyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getColonyByName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      nextToken
    }
  }
`;
export const getUserByAddress = /* GraphQL */ `
  query GetUserByAddress(
    $id: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserByAddress(
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserByName = /* GraphQL */ `
  query GetUserByName(
    $name: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserByName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
