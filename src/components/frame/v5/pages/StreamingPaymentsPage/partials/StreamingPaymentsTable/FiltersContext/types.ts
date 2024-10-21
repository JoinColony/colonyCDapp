import { type SearchStreamingPaymentsQueryVariables } from '~gql';

export enum FiltersValues {
  Status = 'status',
  Date = 'date',
  Custom = 'custom',
  EndCondition = 'endCondition',
  TokenType = 'tokenType',
  TotalStreamedFilters = 'TotalStreamedFilters',
}

export interface TokenTypes {
  [key: string]: boolean;
}

export type SearchStreamingPaymentFilterVariable =
  SearchStreamingPaymentsQueryVariables['filter'];
