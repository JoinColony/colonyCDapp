import { ADDRESS_ZERO } from '~constants/index.ts';
import { useGetContributorsByAddressQuery } from '~gql';
import { type JoinedColony } from '~types/graphql.ts';
import { notNull } from '~utils/arrays/index.ts';

const sortByDate = <T extends { createdAt: string }>(a: T, b: T) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

const useJoinedColonies = (
  userAddress?: string,
): { joinedColonies: JoinedColony[]; loading: boolean } => {
  const { data, loading } = useGetContributorsByAddressQuery({
    variables: {
      contributorAddress: userAddress ?? ADDRESS_ZERO,
      isWatching: true,
    },
    skip: !userAddress,
    fetchPolicy: 'cache-first',
  });
  const joinedColonies =
    data?.getContributorsByAddress?.items
      .filter(notNull)
      .sort(sortByDate)
      .map((contributor) => contributor.colony) ?? [];

  return { joinedColonies, loading };
};

export default useJoinedColonies;
