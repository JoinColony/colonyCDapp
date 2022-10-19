import { AddressZero } from '@ethersproject/constants';

import { ContextModule, getContext } from '~context';
import {
  UserReputationQuery,
  UserReputationQueryVariables,
  UserReputationDocument,
} from '~data/index';
import { Address } from '~types';

export function* updateDomainReputation(
  colonyAddress: Address,
  userAddress: Address,
  domainId: number,
) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  yield apolloClient.query<UserReputationQuery, UserReputationQueryVariables>({
    query: UserReputationDocument,
    variables: {
      colonyAddress,
      address: userAddress,
      domainId,
    },
    fetchPolicy: 'network-only',
  });

  yield apolloClient.query<UserReputationQuery, UserReputationQueryVariables>({
    query: UserReputationDocument,
    variables: {
      colonyAddress,
      address: AddressZero,
      domainId,
    },
    fetchPolicy: 'network-only',
  });
}
