import { ADDRESS_ZERO } from '~constants';
import { useGetContributorsByAddressQuery } from '~gql';
import { notNull } from '~utils/arrays';

const sortByDate = <T extends { createdAt: string }>(a: T, b: T) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

const useJoinedColonies = (userAddress?: string) => {
  const { data, loading } = useGetContributorsByAddressQuery({
    variables: {
      contributorAddress: userAddress ?? ADDRESS_ZERO,
    },
    skip: !userAddress,
  });
  const joinedColonies =
    data?.getContributorsByAddress?.items
      .filter(notNull)
      .sort(sortByDate)
      .map((contributor) => contributor.colony) ?? [];

  return { joinedColonies, loading };
};

export default useJoinedColonies;
