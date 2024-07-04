import useJoinedColonies from './useJoinedColonies.ts';

const useIsContributor = ({
  colonyAddress,
  walletAddress = '',
}: {
  colonyAddress: string;
  walletAddress: string | undefined;
}) => {
  const { joinedColonies, loading } = useJoinedColonies(walletAddress);

  const isContributor = joinedColonies.some(
    (colony) => colony.colonyAddress === colonyAddress,
  );

  return { loading, isContributor };
};

export default useIsContributor;
