import { useGetAllColoniesExtensionsQuery } from '~gql';

const useJoinedColoniesWithExtensions = () => {
  const { data, loading } = useGetAllColoniesExtensionsQuery();

  return {
    joinedColoniesWithExtensions: data?.listColonies?.items || [],
    loading,
  };
};

export default useJoinedColoniesWithExtensions;
