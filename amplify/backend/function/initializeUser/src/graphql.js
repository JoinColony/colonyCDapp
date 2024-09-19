module.exports = {
  getPendingTransactions: /* GraphQL */ `
    query GetPendingTransactions($userAddress: ID!, $nextToken: String) {
      getTransactionsByUser(
        from: $userAddress
        filter: {
          and: [
            { deleted: { ne: true } }
            {
              or: [
                { status: { eq: CREATED } }
                { status: { eq: READY } }
                { status: { eq: PENDING } }
              ]
            }
          ]
        }
        nextToken: $nextToken
      ) {
        items {
          id
          status
        }
        nextToken
      }
    }
  `,
  failTransaction: /* GraphQL */ `
    mutation FailTransaction($id: ID!) {
      updateTransaction(input: { id: $id, status: FAILED }) {
        id
        status
      }
    }
  `,
};
