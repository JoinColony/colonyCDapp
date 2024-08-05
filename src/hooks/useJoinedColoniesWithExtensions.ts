import { useMemo } from 'react';

import { ADDRESS_ZERO } from '~constants/index.ts';
import { useGetJoinedColoniesExtensionsQuery } from '~gql';
import { notNull } from '~utils/arrays/index.ts';

const useJoinedColoniesWithExtensions = (userAddress?: string) => {
  const { data, loading } = useGetJoinedColoniesExtensionsQuery({
    variables: {
      contributorAddress: userAddress ?? ADDRESS_ZERO,
    },
    skip: !userAddress,
    fetchPolicy: 'cache-and-network',
  });

  const joinedColoniesWithExtensions = useMemo(() => {
    return (
      data?.getContributorsByAddress?.items
        .filter(notNull)
        .map((contributor) => contributor.colony) ?? []
    );
  }, [data?.getContributorsByAddress?.items]);

  return {
    joinedColoniesWithExtensions,
    loading,
  };
};

export default useJoinedColoniesWithExtensions;
