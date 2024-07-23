module.exports = {
  createLiquidationAddress: /* GraphQL */ `
    mutation CreateLiquidationAddress(
      $input: CreateLiquidationAddressInput!
      $condition: ModelLiquidationAddressConditionInput
    ) {
      createLiquidationAddress(input: $input, condition: $condition) {
        id
      }
    }
  `,
  getUser: /* GraphQL */ `
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
  `,
  getUserByBridgeCustomerId: /* GraphQL */ `
    query GetUserByBridgeCustomerId($bridgeCustomerId: String!) {
      getUserByBridgeCustomerId(bridgeCustomerId: $bridgeCustomerId) {
        items {
          id
        }
      }
    }
  `,
  updateUser: /* GraphQL */ `
    mutation UpdateUser(
      $input: UpdateUserInput!
      $condition: ModelUserConditionInput
    ) {
      updateUser(input: $input, condition: $condition) {
        id
      }
    }
  `,
};
