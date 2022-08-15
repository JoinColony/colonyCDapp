/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($walletAddress: String!, $username: String!) {
    getUser(walletAddress: $walletAddress, username: $username) {
      walletAddress
      username
      displayName
      avatarHash
      roles {
        id
        createdAt
        updatedAt
        colonyRoleColonyId
        colonyRoleColonyName
      }
      tokens {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $walletAddress: String
    $username: ModelStringKeyConditionInput
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      walletAddress: $walletAddress
      username: $username
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        walletAddress
        username
        displayName
        avatarHash
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getColony = /* GraphQL */ `
  query GetColony($contractAddress: String!, $name: String!) {
    getColony(contractAddress: $contractAddress, name: $name) {
      internalId
      chainId
      chain
      contractAddress
      name
      displayName
      avatarHash
      nativeToken {
        internalId
        contractAddress
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
        userTokensId
        userTokensUsername
        colonyTokensId
        colonyTokensName
      }
      chainVersion
      domains {
        nextToken
      }
      tokens {
        nextToken
      }
      roles {
        nextToken
      }
      createdAt
      updatedAt
      colonyNativeTokenId
      colonyNativeTokenName
    }
  }
`;
export const listColonies = /* GraphQL */ `
  query ListColonies(
    $contractAddress: String
    $name: ModelStringKeyConditionInput
    $filter: ModelColonyFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listColonies(
      contractAddress: $contractAddress
      name: $name
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        internalId
        chainId
        chain
        contractAddress
        name
        displayName
        avatarHash
        chainVersion
        createdAt
        updatedAt
        colonyNativeTokenId
        colonyNativeTokenName
      }
      nextToken
    }
  }
`;
export const getDomain = /* GraphQL */ `
  query GetDomain($internalId: ID!, $chainId: Int!) {
    getDomain(internalId: $internalId, chainId: $chainId) {
      internalId
      chainId
      createdAt
      updatedAt
      colonyDomainsId
      colonyDomainsName
    }
  }
`;
export const listDomains = /* GraphQL */ `
  query ListDomains(
    $internalId: ID
    $chainId: ModelIntKeyConditionInput
    $filter: ModelDomainFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listDomains(
      internalId: $internalId
      chainId: $chainId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        internalId
        chainId
        createdAt
        updatedAt
        colonyDomainsId
        colonyDomainsName
      }
      nextToken
    }
  }
`;
export const getToken = /* GraphQL */ `
  query GetToken($contractAddress: String!, $name: String!) {
    getToken(contractAddress: $contractAddress, name: $name) {
      internalId
      contractAddress
      name
      symbol
      decimals
      type
      createdAt
      updatedAt
      userTokensId
      userTokensUsername
      colonyTokensId
      colonyTokensName
    }
  }
`;
export const listTokens = /* GraphQL */ `
  query ListTokens(
    $contractAddress: String
    $name: ModelStringKeyConditionInput
    $filter: ModelTokenFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listTokens(
      contractAddress: $contractAddress
      name: $name
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        internalId
        contractAddress
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
        userTokensId
        userTokensUsername
        colonyTokensId
        colonyTokensName
      }
      nextToken
    }
  }
`;
export const getColonyRole = /* GraphQL */ `
  query GetColonyRole($id: ID!) {
    getColonyRole(id: $id) {
      colony {
        internalId
        chainId
        chain
        contractAddress
        name
        displayName
        avatarHash
        chainVersion
        createdAt
        updatedAt
        colonyNativeTokenId
        colonyNativeTokenName
      }
      roles {
        nextToken
      }
      id
      createdAt
      updatedAt
      colonyRoleColonyId
      colonyRoleColonyName
    }
  }
`;
export const listColonyRoles = /* GraphQL */ `
  query ListColonyRoles(
    $filter: ModelColonyRoleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listColonyRoles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
        colonyRoleColonyId
        colonyRoleColonyName
      }
      nextToken
    }
  }
`;
export const getRole = /* GraphQL */ `
  query GetRole($internalId: ID!) {
    getRole(internalId: $internalId) {
      internalId
      type
      createdAt
      updatedAt
      colonyRolesId
      colonyRolesName
      colonyRoleRolesId
    }
  }
`;
export const listRoles = /* GraphQL */ `
  query ListRoles(
    $internalId: ID
    $filter: ModelRoleFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listRoles(
      internalId: $internalId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        internalId
        type
        createdAt
        updatedAt
        colonyRolesId
        colonyRolesName
        colonyRoleRolesId
      }
      nextToken
    }
  }
`;
export const getUserByAddress = /* GraphQL */ `
  query GetUserByAddress(
    $walletAddress: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserByAddress(
      walletAddress: $walletAddress
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        walletAddress
        username
        displayName
        avatarHash
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserByUsername = /* GraphQL */ `
  query GetUserByUsername(
    $username: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getUserByUsername(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        walletAddress
        username
        displayName
        avatarHash
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getColonyByAddress = /* GraphQL */ `
  query GetColonyByAddress(
    $contractAddress: String!
    $sortDirection: ModelSortDirection
    $filter: ModelColonyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getColonyByAddress(
      contractAddress: $contractAddress
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        internalId
        chainId
        chain
        contractAddress
        name
        displayName
        avatarHash
        chainVersion
        createdAt
        updatedAt
        colonyNativeTokenId
        colonyNativeTokenName
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
        internalId
        chainId
        chain
        contractAddress
        name
        displayName
        avatarHash
        chainVersion
        createdAt
        updatedAt
        colonyNativeTokenId
        colonyNativeTokenName
      }
      nextToken
    }
  }
`;
export const getTokenByAddress = /* GraphQL */ `
  query GetTokenByAddress(
    $contractAddress: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTokenFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTokenByAddress(
      contractAddress: $contractAddress
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        internalId
        contractAddress
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
        userTokensId
        userTokensUsername
        colonyTokensId
        colonyTokensName
      }
      nextToken
    }
  }
`;
export const getTokensByName = /* GraphQL */ `
  query GetTokensByName(
    $name: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTokenFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTokensByName(
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        internalId
        contractAddress
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
        userTokensId
        userTokensUsername
        colonyTokensId
        colonyTokensName
      }
      nextToken
    }
  }
`;
export const getTokensBySymbol = /* GraphQL */ `
  query GetTokensBySymbol(
    $symbol: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTokenFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTokensBySymbol(
      symbol: $symbol
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        internalId
        contractAddress
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
        userTokensId
        userTokensUsername
        colonyTokensId
        colonyTokensName
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
        internalId
        contractAddress
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
        userTokensId
        userTokensUsername
        colonyTokensId
        colonyTokensName
      }
      nextToken
    }
  }
`;
export const getRolesByType = /* GraphQL */ `
  query GetRolesByType(
    $type: RoleType!
    $sortDirection: ModelSortDirection
    $filter: ModelRoleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getRolesByType(
      type: $type
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        internalId
        type
        createdAt
        updatedAt
        colonyRolesId
        colonyRolesName
        colonyRoleRolesId
      }
      nextToken
    }
  }
`;
