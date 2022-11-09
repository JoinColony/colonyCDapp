/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateToken = /* GraphQL */ `
  subscription OnCreateToken($filter: ModelSubscriptionTokenFilterInput) {
    onCreateToken(filter: $filter) {
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
        transactionHash
        logIndex
        blockNumber
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateToken = /* GraphQL */ `
  subscription OnUpdateToken($filter: ModelSubscriptionTokenFilterInput) {
    onUpdateToken(filter: $filter) {
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
        transactionHash
        logIndex
        blockNumber
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteToken = /* GraphQL */ `
  subscription OnDeleteToken($filter: ModelSubscriptionTokenFilterInput) {
    onDeleteToken(filter: $filter) {
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
        transactionHash
        logIndex
        blockNumber
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateColony = /* GraphQL */ `
  subscription OnCreateColony($filter: ModelSubscriptionColonyFilterInput) {
    onCreateColony(filter: $filter) {
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
        transactionHash
        logIndex
        blockNumber
      }
      createdAt
      updatedAt
      colonyNativeTokenId
    }
  }
`;
export const onUpdateColony = /* GraphQL */ `
  subscription OnUpdateColony($filter: ModelSubscriptionColonyFilterInput) {
    onUpdateColony(filter: $filter) {
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
        transactionHash
        logIndex
        blockNumber
      }
      createdAt
      updatedAt
      colonyNativeTokenId
    }
  }
`;
export const onDeleteColony = /* GraphQL */ `
  subscription OnDeleteColony($filter: ModelSubscriptionColonyFilterInput) {
    onDeleteColony(filter: $filter) {
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
        transactionHash
        logIndex
        blockNumber
      }
      createdAt
      updatedAt
      colonyNativeTokenId
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateDomain = /* GraphQL */ `
  subscription OnCreateDomain($filter: ModelSubscriptionDomainFilterInput) {
    onCreateDomain(filter: $filter) {
      id
      nativeId
      nativeFundingPotId
      nativeSkillId
      name
      description
      color
      parent {
        id
        nativeId
        nativeFundingPotId
        nativeSkillId
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
export const onUpdateDomain = /* GraphQL */ `
  subscription OnUpdateDomain($filter: ModelSubscriptionDomainFilterInput) {
    onUpdateDomain(filter: $filter) {
      id
      nativeId
      nativeFundingPotId
      nativeSkillId
      name
      description
      color
      parent {
        id
        nativeId
        nativeFundingPotId
        nativeSkillId
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
export const onDeleteDomain = /* GraphQL */ `
  subscription OnDeleteDomain($filter: ModelSubscriptionDomainFilterInput) {
    onDeleteDomain(filter: $filter) {
      id
      nativeId
      nativeFundingPotId
      nativeSkillId
      name
      description
      color
      parent {
        id
        nativeId
        nativeFundingPotId
        nativeSkillId
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
export const onCreateColonyFundsClaim = /* GraphQL */ `
  subscription OnCreateColonyFundsClaim(
    $filter: ModelSubscriptionColonyFundsClaimFilterInput
  ) {
    onCreateColonyFundsClaim(filter: $filter) {
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
export const onUpdateColonyFundsClaim = /* GraphQL */ `
  subscription OnUpdateColonyFundsClaim(
    $filter: ModelSubscriptionColonyFundsClaimFilterInput
  ) {
    onUpdateColonyFundsClaim(filter: $filter) {
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
export const onDeleteColonyFundsClaim = /* GraphQL */ `
  subscription OnDeleteColonyFundsClaim(
    $filter: ModelSubscriptionColonyFundsClaimFilterInput
  ) {
    onDeleteColonyFundsClaim(filter: $filter) {
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
export const onCreateContractEvent = /* GraphQL */ `
  subscription OnCreateContractEvent(
    $filter: ModelSubscriptionContractEventFilterInput
  ) {
    onCreateContractEvent(filter: $filter) {
      id
      name
      signature
      meta {
        network
        chainId
        transactionHash
        logIndex
        blockNumber
      }
      colony {
        id
        name
        type
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      token {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      domain {
        id
        nativeId
        nativeFundingPotId
        nativeSkillId
        name
        description
        color
        createdAt
        updatedAt
        colonyDomainsId
        domainParentId
      }
      user {
        id
        name
        createdAt
        updatedAt
      }
      agent
      target
      encodedArguments
      createdAt
      updatedAt
      contractEventColonyId
      contractEventTokenId
      contractEventDomainId
      contractEventUserId
    }
  }
`;
export const onUpdateContractEvent = /* GraphQL */ `
  subscription OnUpdateContractEvent(
    $filter: ModelSubscriptionContractEventFilterInput
  ) {
    onUpdateContractEvent(filter: $filter) {
      id
      name
      signature
      meta {
        network
        chainId
        transactionHash
        logIndex
        blockNumber
      }
      colony {
        id
        name
        type
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      token {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      domain {
        id
        nativeId
        nativeFundingPotId
        nativeSkillId
        name
        description
        color
        createdAt
        updatedAt
        colonyDomainsId
        domainParentId
      }
      user {
        id
        name
        createdAt
        updatedAt
      }
      agent
      target
      encodedArguments
      createdAt
      updatedAt
      contractEventColonyId
      contractEventTokenId
      contractEventDomainId
      contractEventUserId
    }
  }
`;
export const onDeleteContractEvent = /* GraphQL */ `
  subscription OnDeleteContractEvent(
    $filter: ModelSubscriptionContractEventFilterInput
  ) {
    onDeleteContractEvent(filter: $filter) {
      id
      name
      signature
      meta {
        network
        chainId
        transactionHash
        logIndex
        blockNumber
      }
      colony {
        id
        name
        type
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      token {
        id
        name
        symbol
        decimals
        type
        createdAt
        updatedAt
      }
      domain {
        id
        nativeId
        nativeFundingPotId
        nativeSkillId
        name
        description
        color
        createdAt
        updatedAt
        colonyDomainsId
        domainParentId
      }
      user {
        id
        name
        createdAt
        updatedAt
      }
      agent
      target
      encodedArguments
      createdAt
      updatedAt
      contractEventColonyId
      contractEventTokenId
      contractEventDomainId
      contractEventUserId
    }
  }
`;
export const onCreateColonyTokens = /* GraphQL */ `
  subscription OnCreateColonyTokens(
    $filter: ModelSubscriptionColonyTokensFilterInput
  ) {
    onCreateColonyTokens(filter: $filter) {
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
export const onUpdateColonyTokens = /* GraphQL */ `
  subscription OnUpdateColonyTokens(
    $filter: ModelSubscriptionColonyTokensFilterInput
  ) {
    onUpdateColonyTokens(filter: $filter) {
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
export const onDeleteColonyTokens = /* GraphQL */ `
  subscription OnDeleteColonyTokens(
    $filter: ModelSubscriptionColonyTokensFilterInput
  ) {
    onDeleteColonyTokens(filter: $filter) {
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
export const onCreateUserTokens = /* GraphQL */ `
  subscription OnCreateUserTokens(
    $filter: ModelSubscriptionUserTokensFilterInput
  ) {
    onCreateUserTokens(filter: $filter) {
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
export const onUpdateUserTokens = /* GraphQL */ `
  subscription OnUpdateUserTokens(
    $filter: ModelSubscriptionUserTokensFilterInput
  ) {
    onUpdateUserTokens(filter: $filter) {
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
export const onDeleteUserTokens = /* GraphQL */ `
  subscription OnDeleteUserTokens(
    $filter: ModelSubscriptionUserTokensFilterInput
  ) {
    onDeleteUserTokens(filter: $filter) {
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
export const onCreateWatchedColonies = /* GraphQL */ `
  subscription OnCreateWatchedColonies(
    $filter: ModelSubscriptionWatchedColoniesFilterInput
  ) {
    onCreateWatchedColonies(filter: $filter) {
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
export const onUpdateWatchedColonies = /* GraphQL */ `
  subscription OnUpdateWatchedColonies(
    $filter: ModelSubscriptionWatchedColoniesFilterInput
  ) {
    onUpdateWatchedColonies(filter: $filter) {
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
export const onDeleteWatchedColonies = /* GraphQL */ `
  subscription OnDeleteWatchedColonies(
    $filter: ModelSubscriptionWatchedColoniesFilterInput
  ) {
    onDeleteWatchedColonies(filter: $filter) {
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
