import { AddressZero } from '@ethersproject/constants';

import { ContextModule, getContext } from '~context/index.ts';
import {
  GetUserReputationDocument,
  type GetUserReputationQuery,
  type GetUserReputationQueryVariables,
} from '~gql';
import { type Address } from '~types/index.ts';

export function* updateDomainReputation({
  colonyAddress,
  walletAddress,
  domainId,
  rootHash,
}: {
  colonyAddress: Address;
  walletAddress: Address;
  domainId: number;
  rootHash?: string;
}) {
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
