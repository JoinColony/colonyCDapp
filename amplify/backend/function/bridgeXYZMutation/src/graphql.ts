export const createLiquidationAddress = `
  mutation CreateLiquidationAddress(
    $input: CreateLiquidationAddressInput!
    $condition: ModelLiquidationAddressConditionInput
  ) {
    createLiquidationAddress(input: $input, condition: $condition) {
      id
    }
  }
`;

export const getUser = `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      bridgeCustomerId
      liquidationAddresses {
        items {
          id
        }
      }
      profile {
        hasCompletedKYCFlow
      }
    }
  }
`;

export const getUserByBridgeCustomerId = `
  query GetUserByBridgeCustomerId($bridgeCustomerId: String!) {
    getUserByBridgeCustomerId(bridgeCustomerId: $bridgeCustomerId) {
      items {
        id
      }
    }
  }
`;

export const updateUser = `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
    }
  }
`;
