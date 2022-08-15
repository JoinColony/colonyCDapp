/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
  subscription OnUpdateUser {
    onUpdateUser {
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
  subscription OnDeleteUser {
    onDeleteUser {
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
  subscription OnCreateColony {
    onCreateColony {
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
  subscription OnUpdateColony {
    onUpdateColony {
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
  subscription OnDeleteColony {
    onDeleteColony {
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
  subscription OnCreateDomain {
    onCreateDomain {
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
  subscription OnUpdateDomain {
    onUpdateDomain {
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
  subscription OnDeleteDomain {
    onDeleteDomain {
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
  subscription OnCreateToken {
    onCreateToken {
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
  subscription OnUpdateToken {
    onUpdateToken {
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
  subscription OnDeleteToken {
    onDeleteToken {
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
  subscription OnCreateColonyRole {
    onCreateColonyRole {
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
  subscription OnUpdateColonyRole {
    onUpdateColonyRole {
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
  subscription OnDeleteColonyRole {
    onDeleteColonyRole {
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
  subscription OnCreateRole {
    onCreateRole {
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
  subscription OnUpdateRole {
    onUpdateRole {
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
  subscription OnDeleteRole {
    onDeleteRole {
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
