/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      createdAt
      updatedAt
      colonyNativeTokenId
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
        createdAt
        updatedAt
        colonyNativeTokenId
      }
      createdAt
      updatedAt
    }
  }
`;
