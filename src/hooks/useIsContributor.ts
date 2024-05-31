import useJoinedColonies from './useJoinedColonies.ts';

const useIsContributor = ({
  walletAddress = '',
  colonyAddress = '',
}: {
  walletAddress: string | undefined;
  colonyAddress: string | undefined;
}) => {
  const { joinedColonies, loading } = useJoinedColonies(walletAddress);

  const isContributor = joinedColonies.some(
    (colony) => colony.colonyAddress === colonyAddress,
  );

  return { loading, isContributor };
};

export default useIsContributor;
