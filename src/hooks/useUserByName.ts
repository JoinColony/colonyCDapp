import { useGetUserByNameQuery } from '~gql';

const useUserByName = (username: string) => {
  const { data, error, loading } = useGetUserByNameQuery({
    variables: {
      name: username,
    },
    fetchPolicy: 'cache-and-network',
  });

  const user = data?.getUserByName?.items[0];

  return {
    user,
    loading,
    error,
  };
};

export default useUserByName;
