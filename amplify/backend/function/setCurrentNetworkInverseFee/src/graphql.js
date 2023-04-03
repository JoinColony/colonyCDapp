module.exports = {
  getCurrentNetworkInverseFee: /* GraphQL */ `
    query GetCurrentNetworkInverseFee {
      listCurrentNetworkInverseFees(limit: 1) {
        items {
          id
          inverseFee
        }
      }
    }
  `,
  createCurrentNetworkInverseFee: /* GraphQL */ `
    mutation CreateCurrentNetworkInverseFee($input: CreateCurrentNetworkInverseFeeInput!) {
      createCurrentNetworkInverseFee(input: $input) {
        id
      }
    }
  `,
  updateCurrentNetworkInverseFee: /* GraphQL */ `
    mutation UpdateCurrentNetworkInverseFee($input: UpdateCurrentNetworkInverseFeeInput!) {
      updateCurrentNetworkInverseFee(input: $input) {
        id
      }
    }
  `,
};
