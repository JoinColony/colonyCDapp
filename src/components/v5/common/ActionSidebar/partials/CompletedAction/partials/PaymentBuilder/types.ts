import { type ApolloQueryResult } from '@apollo/client';

import { type GetExpenditureQuery } from '~gql';

export type RefetchExpenditureType = (variables?: {
  expenditureId: string;
}) => Promise<ApolloQueryResult<GetExpenditureQuery>>;
