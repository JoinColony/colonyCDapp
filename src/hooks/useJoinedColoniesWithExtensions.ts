import { ADDRESS_ZERO } from '~constants/index.ts';
import { useGetAllColoniesExtensionsQuery } from '~gql';
import { notNull } from '~utils/arrays/index.ts';

const sortByDate = <T extends { createdAt: string }>(a: T, b: T) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

const useJoinedColoniesWithExtensions = (userAddress?: string) => {
  const { data, loading } = useGetAllColoniesExtensionsQuery({
    variables: {
      contributorAddress: userAddress ?? ADDRESS_ZERO,
      isWatching: true,
    },
    skip: !userAddress,
    fetchPolicy: 'cache-and-network',
  });
  const joinedColoniesWithExtensions =
    data?.getContributorsByAddress?.items
      .filter(notNull)
      .sort(sortByDate)
      .map((contributor) => contributor.colony) ?? [];

  return { joinedColoniesWithExtensions, loading };
};

export default useJoinedColoniesWithExtensions;
