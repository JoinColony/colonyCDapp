import { useMemo } from 'react';
import { useGetColonyContributorsQuery } from '~gql';
import { useColonyContext } from '~hooks';

export const useGetMembersWithRecovery = () => {
  const { colony } = useColonyContext();
  const { colonyAddress } = colony || {};

  const { data, loading } = useGetColonyContributorsQuery({
    variables: {
      colonyAddress: colonyAddress || '',
    },
    skip: !colonyAddress,
  });

  const { items } = data?.getContributorsByColony || {};

  const usersWithRecoveryRole = useMemo(
    () =>
      items?.filter((member) =>
        member?.roles?.items?.some((role) => role?.role_0),
      ),
    [items],
  );

  return {
    loading,
    usersWithRecoveryRole,
  };
};
