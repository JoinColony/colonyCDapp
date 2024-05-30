import useJoinedColonies from './useJoinedColonies.ts';

const useIsContributor = ({
  walletAddress = '',
  colonyAddress = '',
}: {
  walletAddress: string | undefined;
  colonyAddress: string | undefined;
}) => {
  const { joinedColonies, loading } = useJoinedColonies(walletAddress);

  const isContributor = joinedColonies
    .map((col) => col.colonyAddress)
    .includes(colonyAddress);

  return { loading, isContributor };
};

export default useIsContributor;
