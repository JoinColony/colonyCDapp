/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateColony = /* GraphQL */ `
  subscription OnCreateColony($filter: ModelSubscriptionColonyFilterInput) {
    onCreateColony(filter: $filter) {
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
export const onUpdateColony = /* GraphQL */ `
  subscription OnUpdateColony($filter: ModelSubscriptionColonyFilterInput) {
    onUpdateColony(filter: $filter) {
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
export const onDeleteColony = /* GraphQL */ `
  subscription OnDeleteColony($filter: ModelSubscriptionColonyFilterInput) {
    onDeleteColony(filter: $filter) {
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
export const onCreateDomain = /* GraphQL */ `
  subscription OnCreateDomain($filter: ModelSubscriptionDomainFilterInput) {
    onCreateDomain(filter: $filter) {
      internalId
      chainId
      createdAt
      updatedAt
      colonyDomainsId
      colonyDomainsName
    }
  }
`;
export const onUpdateDomain = /* GraphQL */ `
  subscription OnUpdateDomain($filter: ModelSubscriptionDomainFilterInput) {
    onUpdateDomain(filter: $filter) {
      internalId
      chainId
      createdAt
      updatedAt
      colonyDomainsId
      colonyDomainsName
    }
  }
`;
export const onDeleteDomain = /* GraphQL */ `
  subscription OnDeleteDomain($filter: ModelSubscriptionDomainFilterInput) {
    onDeleteDomain(filter: $filter) {
      internalId
      chainId
      createdAt
      updatedAt
      colonyDomainsId
      colonyDomainsName
    }
  }
`;
export const onCreateToken = /* GraphQL */ `
  subscription OnCreateToken($filter: ModelSubscriptionTokenFilterInput) {
    onCreateToken(filter: $filter) {
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
export const onUpdateToken = /* GraphQL */ `
  subscription OnUpdateToken($filter: ModelSubscriptionTokenFilterInput) {
    onUpdateToken(filter: $filter) {
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
export const onDeleteToken = /* GraphQL */ `
  subscription OnDeleteToken($filter: ModelSubscriptionTokenFilterInput) {
    onDeleteToken(filter: $filter) {
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
export const onCreateColonyRole = /* GraphQL */ `
  subscription OnCreateColonyRole(
    $filter: ModelSubscriptionColonyRoleFilterInput
  ) {
    onCreateColonyRole(filter: $filter) {
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
export const onUpdateColonyRole = /* GraphQL */ `
  subscription OnUpdateColonyRole(
    $filter: ModelSubscriptionColonyRoleFilterInput
  ) {
    onUpdateColonyRole(filter: $filter) {
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
export const onDeleteColonyRole = /* GraphQL */ `
  subscription OnDeleteColonyRole(
    $filter: ModelSubscriptionColonyRoleFilterInput
  ) {
    onDeleteColonyRole(filter: $filter) {
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
export const onCreateRole = /* GraphQL */ `
  subscription OnCreateRole($filter: ModelSubscriptionRoleFilterInput) {
    onCreateRole(filter: $filter) {
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
export const onUpdateRole = /* GraphQL */ `
  subscription OnUpdateRole($filter: ModelSubscriptionRoleFilterInput) {
    onUpdateRole(filter: $filter) {
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
export const onDeleteRole = /* GraphQL */ `
  subscription OnDeleteRole($filter: ModelSubscriptionRoleFilterInput) {
    onDeleteRole(filter: $filter) {
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
