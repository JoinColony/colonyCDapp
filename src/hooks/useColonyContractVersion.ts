import { useGetNewestColonyContractVersionQuery } from '~gql';

const useColonyContractVersion = () => {
  const { data, loading: loadingColonyContractVersion } =
    useGetNewestColonyContractVersionQuery();
  const colonyContractVersion = Number(
    data?.getNewestColonyContractVersion || '0',
  );

  return {
    colonyContractVersion,
    loadingColonyContractVersion,
  };
};

export default useColonyContractVersion;
