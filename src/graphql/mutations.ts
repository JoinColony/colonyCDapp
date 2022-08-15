/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createColony = /* GraphQL */ `
  mutation CreateColony(
    $input: CreateColonyInput!
    $condition: ModelColonyConditionInput
  ) {
    createColony(input: $input, condition: $condition) {
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
export const updateColony = /* GraphQL */ `
  mutation UpdateColony(
    $input: UpdateColonyInput!
    $condition: ModelColonyConditionInput
  ) {
    updateColony(input: $input, condition: $condition) {
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
export const deleteColony = /* GraphQL */ `
  mutation DeleteColony(
    $input: DeleteColonyInput!
    $condition: ModelColonyConditionInput
  ) {
    deleteColony(input: $input, condition: $condition) {
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
export const createDomain = /* GraphQL */ `
  mutation CreateDomain(
    $input: CreateDomainInput!
    $condition: ModelDomainConditionInput
  ) {
    createDomain(input: $input, condition: $condition) {
      internalId
      chainId
      createdAt
      updatedAt
      colonyDomainsId
      colonyDomainsName
    }
  }
`;
export const updateDomain = /* GraphQL */ `
  mutation UpdateDomain(
    $input: UpdateDomainInput!
    $condition: ModelDomainConditionInput
  ) {
    updateDomain(input: $input, condition: $condition) {
      internalId
      chainId
      createdAt
      updatedAt
      colonyDomainsId
      colonyDomainsName
    }
  }
`;
export const deleteDomain = /* GraphQL */ `
  mutation DeleteDomain(
    $input: DeleteDomainInput!
    $condition: ModelDomainConditionInput
  ) {
    deleteDomain(input: $input, condition: $condition) {
      internalId
      chainId
      createdAt
      updatedAt
      colonyDomainsId
      colonyDomainsName
    }
  }
`;
export const createToken = /* GraphQL */ `
  mutation CreateToken(
    $input: CreateTokenInput!
    $condition: ModelTokenConditionInput
  ) {
    createToken(input: $input, condition: $condition) {
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
export const updateToken = /* GraphQL */ `
  mutation UpdateToken(
    $input: UpdateTokenInput!
    $condition: ModelTokenConditionInput
  ) {
    updateToken(input: $input, condition: $condition) {
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
export const deleteToken = /* GraphQL */ `
  mutation DeleteToken(
    $input: DeleteTokenInput!
    $condition: ModelTokenConditionInput
  ) {
    deleteToken(input: $input, condition: $condition) {
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
export const createColonyRole = /* GraphQL */ `
  mutation CreateColonyRole(
    $input: CreateColonyRoleInput!
    $condition: ModelColonyRoleConditionInput
  ) {
    createColonyRole(input: $input, condition: $condition) {
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
export const updateColonyRole = /* GraphQL */ `
  mutation UpdateColonyRole(
    $input: UpdateColonyRoleInput!
    $condition: ModelColonyRoleConditionInput
  ) {
    updateColonyRole(input: $input, condition: $condition) {
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
export const deleteColonyRole = /* GraphQL */ `
  mutation DeleteColonyRole(
    $input: DeleteColonyRoleInput!
    $condition: ModelColonyRoleConditionInput
  ) {
    deleteColonyRole(input: $input, condition: $condition) {
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
export const createRole = /* GraphQL */ `
  mutation CreateRole(
    $input: CreateRoleInput!
    $condition: ModelRoleConditionInput
  ) {
    createRole(input: $input, condition: $condition) {
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
export const updateRole = /* GraphQL */ `
  mutation UpdateRole(
    $input: UpdateRoleInput!
    $condition: ModelRoleConditionInput
  ) {
    updateRole(input: $input, condition: $condition) {
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
export const deleteRole = /* GraphQL */ `
  mutation DeleteRole(
    $input: DeleteRoleInput!
    $condition: ModelRoleConditionInput
  ) {
    deleteRole(input: $input, condition: $condition) {
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
