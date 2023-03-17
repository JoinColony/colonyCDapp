import { useGetNetworkInverseFeeQuery } from '~gql';

const useNetworkInverseFee = () => {
  const { data, loading: loadingNetworkInverseFee } =
    useGetNetworkInverseFeeQuery();
  const networkInverseFee = data?.getNetworkInverseFee ?? '0';

  return {
    networkInverseFee,
    loadingNetworkInverseFee,
  };
};

export default useNetworkInverseFee;
