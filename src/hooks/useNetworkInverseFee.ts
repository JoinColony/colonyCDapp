import { useGetCurrentNetworkInverseFeeQuery } from '~gql';

const useNetworkInverseFee = () => {
  const { data, loading: loadingNetworkInverseFee } =
    useGetCurrentNetworkInverseFeeQuery();
  const networkInverseFee =
    data?.listCurrentNetworkInverseFees?.items[0]?.inverseFee;

  return {
    networkInverseFee,
    loadingNetworkInverseFee,
  };
};

export default useNetworkInverseFee;
