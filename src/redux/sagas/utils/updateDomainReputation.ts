import { AddressZero } from '@ethersproject/constants';

import { ContextModule, getContext } from '~context/index.ts';
import {
  GetUserReputationDocument,
  GetUserReputationQuery,
  GetUserReputationQueryVariables,
} from '~gql';
import { Address } from '~types/index.ts';

export function* updateDomainReputation(
  colonyAddress: Address,
  walletAddress: Address,
  domainId: number,
  rootHash?: string,
) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  yield apolloClient.query<
    GetUserReputationQuery,
    GetUserReputationQueryVariables
  >({
    query: GetUserReputationDocument,
    variables: {
      input: {
        colonyAddress: colonyAddress ?? '',
        walletAddress: walletAddress ?? '',
        domainId,
        rootHash,
      },
    },
    fetchPolicy: 'network-only',
  });

  yield apolloClient.query<
    GetUserReputationQuery,
    GetUserReputationQueryVariables
  >({
    query: GetUserReputationDocument,
    variables: {
      input: {
        colonyAddress: colonyAddress ?? '',
        walletAddress: AddressZero,
        domainId,
        rootHash,
      },
    },
    fetchPolicy: 'network-only',
  });
}
