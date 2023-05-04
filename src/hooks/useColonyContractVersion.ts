import { useGetCurrentColonyVersionQuery } from '~gql';

const useColonyContractVersion = () => {
  const { data, loading: loadingColonyContractVersion } = useGetCurrentColonyVersionQuery();
  const colonyContractVersion = Number(data?.getCurrentVersionByKey?.items[0]?.version || '0');

  return {
    colonyContractVersion,
    loadingColonyContractVersion,
  };
};

export default useColonyContractVersion;
