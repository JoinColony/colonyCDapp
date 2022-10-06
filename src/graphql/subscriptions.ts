/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateToken = /* GraphQL */ `
  subscription OnCreateToken {
    onCreateToken {
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
export const onUpdateToken = /* GraphQL */ `
  subscription OnUpdateToken {
    onUpdateToken {
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
export const onDeleteToken = /* GraphQL */ `
  subscription OnDeleteToken {
    onDeleteToken {
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
export const onCreateColony = /* GraphQL */ `
  subscription OnCreateColony {
    onCreateColony {
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
export const onUpdateColony = /* GraphQL */ `
  subscription OnUpdateColony {
    onUpdateColony {
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
export const onDeleteColony = /* GraphQL */ `
  subscription OnDeleteColony {
    onDeleteColony {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateColonyTokens = /* GraphQL */ `
  subscription OnCreateColonyTokens {
    onCreateColonyTokens {
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
export const onUpdateColonyTokens = /* GraphQL */ `
  subscription OnUpdateColonyTokens {
    onUpdateColonyTokens {
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
export const onDeleteColonyTokens = /* GraphQL */ `
  subscription OnDeleteColonyTokens {
    onDeleteColonyTokens {
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
export const onCreateUserTokens = /* GraphQL */ `
  subscription OnCreateUserTokens {
    onCreateUserTokens {
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
  subscription OnUpdateUserTokens {
    onUpdateUserTokens {
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
  subscription OnDeleteUserTokens {
    onDeleteUserTokens {
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
