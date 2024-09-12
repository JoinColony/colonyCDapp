module.exports = {
  saveCacheTotalBalance: /* GraphQL */ `
    mutation SaveCacheTotalBalance($input: CreateCacheTotalBalanceInput!) {
      createCacheTotalBalance(input: $input) {
        totalIn
        totalOut
      }
    }
  `,
  updateCacheTotalBalance: /* GraphQL */ `
    mutation UpdateCacheTotalBalance($input: UpdateCacheTotalBalanceInput!) {
      updateCacheTotalBalance(input: $input) {
        totalIn
        totalOut
      }
    }
  `,
  getCachedTotalBalance: /* GraphQL */ `
    query GetCachedTotalBalance(
      $colonyAddress: String!
      $filter: ModelCacheTotalBalanceFilterInput
    ) {
      cacheTotalBalanceByColonyAddress(
        colonyAddress: $colonyAddress
        filter: $filter
      ) {
        items {
          id
          domainId
          colonyAddress
          timeframeType
          timeframePeriod
          totalIn
          totalOut
          date
        }
      }
    }
  `,
  getColonies: /* GraphQL */ `
    query GetColonies($nextToken: String, $limit: Int) {
      listColonies(nextToken: $nextToken, limit: $limit) {
        items {
          id
        }
      }
    }
  `,
  getColonyDomains: /* GraphQL */ `
    query GetColonyDomains($colonyAddress: ID!) {
      getDomainsByColony(colonyId: $colonyAddress) {
        items {
          nativeFundingPotId
          nativeId
          colonyId
          id
          isRoot
          # probably we need to rootId when nested teams is in place
        }
      }
    }
  `,
  getDomainBalance: /* GraphQL */ `
    query GetDomainBalance(
      $colonyAddress: String!
      $domainId: String
      $timeframePeriod: Int!
      $timeframeType: TimeframeType
      $timeframePeriodEndDate: AWSDateTime
    ) {
      getDomainBalance(
        input: {
          colonyAddress: $colonyAddress
          domainId: $domainId
          timeframePeriod: $timeframePeriod
          timeframeType: $timeframeType
          timeframePeriodEndDate: $timeframePeriodEndDate
          selectedCurrency: USDC
        }
      ) {
        totalIn
        totalOut
      }
    }
  `,
};
