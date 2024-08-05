const tokenFragment = /* GraphQL */ `
  fragment LightTokenFragment on Token {
    chainMetadata {
      chainId
      network
    }
    createdAt
    decimals
    id
    name
    symbol
    type
    updatedAt
  }
`;

module.exports = {
  saveTokenExchangeRate: /* GraphQL */`
    mutation SaveTokenExchangeRate($input: CreateTokenExchangeRateInput!) {
      createTokenExchangeRate(input: $input) {
        tokenId
        date
        marketPrice {
            currency
            rate
          }
      }
    }
  `,
  getTokenExchangeRate: /* GraphQL */`
    query GetTokenExchangeRateByTokenId(
      $tokenId: String!
      $date: String
      $filter: ModelTokenExchangeRateFilterInput
    ) {
      tokenExhangeRateByTokenId(
        tokenId: $tokenId
        date: { eq: $date }
        filter: $filter
      ) {
        items {
          tokenId
          date
          marketPrice {
            currency
            rate
          }
        }
        nextToken
      }
    }
  `,
  getColonyDomains: /* GraphQL */`
    query GetColonyDomains(
      $colonyAddress: ID!
    ) {
      listDomains(
        filter: {
          colonyId: { eq: $colonyAddress }
        }
      ) {
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
  getColonyFundsClaims: /* GraphQL */`
    ${tokenFragment}
    query GetColonyFundsClaims(
      $colonyAddress: ID!
      $nextToken: String
      $limit: Int
    ) {
      listColonyFundsClaims(
        nextToken: $nextToken
        limit: $limit
        filter: {
          isClaimed: { eq: true },
          colonyFundsClaimsId: { eq: $colonyAddress }
        }
      ) {
        items {
          amount
          isClaimed
          updatedAt
          colonyFundsClaimsId
          token {
            ...LightTokenFragment
          }
        }
      }
    }
  `,
  getDomainExpenditures: /* GraphQL */`
    query GetDomainExpenditures(
      $nativeDomainId: Int!
      $nextToken: String
      $limit: Int
    ) {
      listExpenditures(
        nextToken: $nextToken
        limit: $limit
        filter: {
          nativeDomainId: { eq: $nativeDomainId },
          status: { eq: FINALIZED }
        }
      ) {
        items {
          id
          finalizedAt
          slots {
            claimDelay
            id
            payouts {
              amount
              isClaimed
              networkFee
              tokenAddress
            }
          }
        }
      }
    }
  `,
  getColonyActions: /* GraphQL */`
    ${tokenFragment}
    query GetColonyActions(
      $colonyAddress: ID!
      $nextToken: String
      $limit: Int
      $filter: ModelColonyActionFilterInput
    ) {
      getActionsByColony(
        colonyId: $colonyAddress
        nextToken: $nextToken
        limit: $limit
        filter: $filter
      ) {
        items {
          fromDomainId
          toDomainId
          amount
          networkFee
          type
          metadata {
            customTitle
          }
          createdAt
          updatedAt
          showInActionsList
          isMotion
          motionData {
            motionStateHistory {
              finalizedAt
              hasPassed
            }
          }
          token {
            # NOTE: Token doesn't have a lightweight Display-only Fragment, as the props
            # on that fragment are just 2 less than the actual "full" version of the Fragment
            ...LightTokenFragment
          }
        }
        nextToken
      }
    }
  `,
};
