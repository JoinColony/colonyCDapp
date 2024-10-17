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
  saveTokenExchangeRate: /* GraphQL */ `
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
  getTokenExchangeRate: /* GraphQL */ `
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
  getColonyFundsClaims: /* GraphQL */ `
    ${tokenFragment}
    query GetColonyFundsClaims(
      $colonyAddress: ID!
      $nextToken: String
      $limit: Int
    ) {
      getFundsClaimsByColony(
        nextToken: $nextToken
        limit: $limit
        colonyFundsClaimsId: $colonyAddress
        filter: { isClaimed: { eq: true } }
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
  getColonyExpenditures: /* GraphQL */ `
    query GetColonyExpenditures(
      $colonyAddress: ID!
      $nextToken: String
      $limit: Int
    ) {
      getExpendituresByColony(
        colonyId: $colonyAddress
        nextToken: $nextToken
        limit: $limit
        filter: { status: { eq: FINALIZED } }
      ) {
        items {
          id
          finalizedAt
          createdAt
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
          createExpenditureActions: actions(
            filter: { type: { eq: CREATE_EXPENDITURE } }
          ) {
            items {
              id
            }
          }
        }
      }
    }
  `,
  getDomainExpenditures: /* GraphQL */ `
    query GetDomainExpenditures(
      $colonyAddress: ID!
      $nativeDomainId: Int!
      $nextToken: String
      $limit: Int
    ) {
      listExpenditures(
        nextToken: $nextToken
        limit: $limit
        filter: {
          colonyId: { eq: $colonyAddress }
          nativeDomainId: { eq: $nativeDomainId }
          status: { eq: FINALIZED }
        }
      ) {
        items {
          id
          finalizedAt
          createdAt
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
          createExpenditureActions: actions(
            filter: { type: { eq: CREATE_EXPENDITURE } }
          ) {
            items {
              id
            }
          }
        }
      }
    }
  `,
  getColonyActions: /* GraphQL */ `
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
          isMultiSig
          multiSigData {
            executedAt
            isExecuted
          }
          initiatorExtension {
            id
          }
          rootHash
          token {
            ...LightTokenFragment
          }
        }
        nextToken
      }
    }
  `,
  getToken: /* GraphQL */ `
    query GetToken($tokenAddress: ID!) {
      getToken(id: $tokenAddress) {
        id
        decimals
      }
    }
  `,
};
