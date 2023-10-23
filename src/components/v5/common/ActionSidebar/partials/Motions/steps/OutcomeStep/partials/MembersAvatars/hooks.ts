import { Id } from '@colony/colony-js';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import { useGetMembersForColonyQuery } from '~gql';
import { useColonyContext } from '~hooks';

export const useMemberAvatars = (
  currentDomainId = COLONY_TOTAL_BALANCE_DOMAIN_ID,
) => {
  const { colony } = useColonyContext();

  const { data, loading } = useGetMembersForColonyQuery({
    skip: !colony?.colonyAddress,
    variables: {
      input: {
        colonyAddress: colony?.colonyAddress ?? '',
        domainId: currentDomainId || Id.RootDomain,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const watchers = data?.getMembersForColony?.watchers;

  return {
    watchers: watchers || [],
    loading,
  };
};
