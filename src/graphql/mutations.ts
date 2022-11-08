/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUniqueUser = /* GraphQL */ `
  mutation CreateUniqueUser($input: CreateUniqueUserInput) {
    createUniqueUser(input: $input) {
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
        email
      }
      watchlist {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createUniqueColony = /* GraphQL */ `
  mutation CreateUniqueColony($input: CreateUniqueColonyInput) {
    createUniqueColony(input: $input) {
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
        email
      }
      watchlist {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createUniqueDomain = /* GraphQL */ `
  mutation CreateUniqueDomain($input: CreateUniqueDomainInput) {
    createUniqueDomain(input: $input) {
      id
      nativeId
      name
      description
      color
      parent {
        id
        nativeId
        name
        description
        color
        createdAt
        updatedAt
        colonyDomainsId
        domainParentId
      }
      createdAt
      updatedAt
      colonyDomainsId
      domainParentId
    }
  }
`;
export const createToken = /* GraphQL */ `
  mutation CreateToken(
    $input: CreateTokenInput!
    $condition: ModelTokenConditionInput
  ) {
    createToken(input: $input, condition: $condition) {
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
      meta {
        network
        chainId
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateToken = /* GraphQL */ `
  mutation UpdateToken(
    $input: UpdateTokenInput!
    $condition: ModelTokenConditionInput
  ) {
    updateToken(input: $input, condition: $condition) {
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
      meta {
        network
        chainId
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteToken = /* GraphQL */ `
  mutation DeleteToken(
    $input: DeleteTokenInput!
    $condition: ModelTokenConditionInput
  ) {
    deleteToken(input: $input, condition: $condition) {
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
      meta {
        network
        chainId
      }
      createdAt
      updatedAt
    }
  }
`;
export const createColony = /* GraphQL */ `
  mutation CreateColony(
    $input: CreateColonyInput!
    $condition: ModelColonyConditionInput
  ) {
    createColony(input: $input, condition: $condition) {
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
        email
      }
      status {
        recovery
      }
      domains {
        nextToken
      }
      watchers {
        nextToken
      }
      fundsClaims {
        nextToken
      }
      chainFundsClaim {
        id
        createdAtBlock
        createdAt
        updatedAt
        amount
      }
      type
      meta {
        network
        chainId
      }
      createdAt
      updatedAt
      colonyNativeTokenId
    }
  }
`;
export const updateColony = /* GraphQL */ `
  mutation UpdateColony(
    $input: UpdateColonyInput!
    $condition: ModelColonyConditionInput
  ) {
    updateColony(input: $input, condition: $condition) {
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
        email
      }
      status {
        recovery
      }
      domains {
        nextToken
      }
      watchers {
        nextToken
      }
      fundsClaims {
        nextToken
      }
      chainFundsClaim {
        id
        createdAtBlock
        createdAt
        updatedAt
        amount
      }
      type
      meta {
        network
        chainId
      }
      createdAt
      updatedAt
      colonyNativeTokenId
    }
  }
`;
export const deleteColony = /* GraphQL */ `
  mutation DeleteColony(
    $input: DeleteColonyInput!
    $condition: ModelColonyConditionInput
  ) {
    deleteColony(input: $input, condition: $condition) {
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
        email
      }
      status {
        recovery
      }
      domains {
        nextToken
      }
      watchers {
        nextToken
      }
      fundsClaims {
        nextToken
      }
      chainFundsClaim {
        id
        createdAtBlock
        createdAt
        updatedAt
        amount
      }
      type
      meta {
        network
        chainId
      }
      createdAt
      updatedAt
      colonyNativeTokenId
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
        email
      }
      watchlist {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
        email
      }
      watchlist {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
        email
      }
      watchlist {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createDomain = /* GraphQL */ `
  mutation CreateDomain(
    $input: CreateDomainInput!
    $condition: ModelDomainConditionInput
  ) {
    createDomain(input: $input, condition: $condition) {
      id
      nativeId
      name
      description
      color
      parent {
        id
        nativeId
        name
        description
        color
        createdAt
        updatedAt
        colonyDomainsId
        domainParentId
      }
      createdAt
      updatedAt
      colonyDomainsId
      domainParentId
    }
  }
`;
export const updateDomain = /* GraphQL */ `
  mutation UpdateDomain(
    $input: UpdateDomainInput!
    $condition: ModelDomainConditionInput
  ) {
    updateDomain(input: $input, condition: $condition) {
      id
      nativeId
      name
      description
      color
      parent {
        id
        nativeId
        name
        description
        color
        createdAt
        updatedAt
        colonyDomainsId
        domainParentId
      }
      createdAt
      updatedAt
      colonyDomainsId
      domainParentId
    }
  }
`;
export const deleteDomain = /* GraphQL */ `
  mutation DeleteDomain(
    $input: DeleteDomainInput!
    $condition: ModelDomainConditionInput
  ) {
    deleteDomain(input: $input, condition: $condition) {
      id
      nativeId
      name
      description
      color
      parent {
        id
        nativeId
        name
        description
        color
        createdAt
        updatedAt
        colonyDomainsId
        domainParentId
      }
      createdAt
      updatedAt
      colonyDomainsId
      domainParentId
    }
  }
`;
export const createColonyFundsClaim = /* GraphQL */ `
  mutation CreateColonyFundsClaim(
    $input: CreateColonyFundsClaimInput!
    $condition: ModelColonyFundsClaimConditionInput
  ) {
    createColonyFundsClaim(input: $input, condition: $condition) {
      id
      token {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      createdAtBlock
      createdAt
      amount
      updatedAt
      colonyFundsClaimsId
      colonyFundsClaimTokenId
    }
  }
`;
export const updateColonyFundsClaim = /* GraphQL */ `
  mutation UpdateColonyFundsClaim(
    $input: UpdateColonyFundsClaimInput!
    $condition: ModelColonyFundsClaimConditionInput
  ) {
    updateColonyFundsClaim(input: $input, condition: $condition) {
      id
      token {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      createdAtBlock
      createdAt
      amount
      updatedAt
      colonyFundsClaimsId
      colonyFundsClaimTokenId
    }
  }
`;
export const deleteColonyFundsClaim = /* GraphQL */ `
  mutation DeleteColonyFundsClaim(
    $input: DeleteColonyFundsClaimInput!
    $condition: ModelColonyFundsClaimConditionInput
  ) {
    deleteColonyFundsClaim(input: $input, condition: $condition) {
      id
      token {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      createdAtBlock
      createdAt
      amount
      updatedAt
      colonyFundsClaimsId
      colonyFundsClaimTokenId
    }
  }
`;
export const createColonyTokens = /* GraphQL */ `
  mutation CreateColonyTokens(
    $input: CreateColonyTokensInput!
    $condition: ModelColonyTokensConditionInput
  ) {
    createColonyTokens(input: $input, condition: $condition) {
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
        type
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateColonyTokens = /* GraphQL */ `
  mutation UpdateColonyTokens(
    $input: UpdateColonyTokensInput!
    $condition: ModelColonyTokensConditionInput
  ) {
    updateColonyTokens(input: $input, condition: $condition) {
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
        type
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteColonyTokens = /* GraphQL */ `
  mutation DeleteColonyTokens(
    $input: DeleteColonyTokensInput!
    $condition: ModelColonyTokensConditionInput
  ) {
    deleteColonyTokens(input: $input, condition: $condition) {
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
        type
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      createdAt
      updatedAt
    }
  }
`;
export const createUserTokens = /* GraphQL */ `
  mutation CreateUserTokens(
    $input: CreateUserTokensInput!
    $condition: ModelUserTokensConditionInput
  ) {
    createUserTokens(input: $input, condition: $condition) {
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
export const updateUserTokens = /* GraphQL */ `
  mutation UpdateUserTokens(
    $input: UpdateUserTokensInput!
    $condition: ModelUserTokensConditionInput
  ) {
    updateUserTokens(input: $input, condition: $condition) {
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
export const deleteUserTokens = /* GraphQL */ `
  mutation DeleteUserTokens(
    $input: DeleteUserTokensInput!
    $condition: ModelUserTokensConditionInput
  ) {
    deleteUserTokens(input: $input, condition: $condition) {
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
export const createWatchedColonies = /* GraphQL */ `
  mutation CreateWatchedColonies(
    $input: CreateWatchedColoniesInput!
    $condition: ModelWatchedColoniesConditionInput
  ) {
    createWatchedColonies(input: $input, condition: $condition) {
      id
      colonyID
      userID
      colony {
        id
        name
        type
        createdAt
        updatedAt
        colonyNativeTokenId
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
export const updateWatchedColonies = /* GraphQL */ `
  mutation UpdateWatchedColonies(
    $input: UpdateWatchedColoniesInput!
    $condition: ModelWatchedColoniesConditionInput
  ) {
    updateWatchedColonies(input: $input, condition: $condition) {
      id
      colonyID
      userID
      colony {
        id
        name
        type
        createdAt
        updatedAt
        colonyNativeTokenId
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
export const deleteWatchedColonies = /* GraphQL */ `
  mutation DeleteWatchedColonies(
    $input: DeleteWatchedColoniesInput!
    $condition: ModelWatchedColoniesConditionInput
  ) {
    deleteWatchedColonies(input: $input, condition: $condition) {
      id
      colonyID
      userID
      colony {
        id
        name
        type
        createdAt
        updatedAt
        colonyNativeTokenId
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
