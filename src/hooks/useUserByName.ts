import { useGetUserByNameQuery } from '~gql';

const useUserByName = (username: string) => {
  const { data, error, loading } = useGetUserByNameQuery({
    variables: {
      name: username,
    },
    fetchPolicy: 'cache-and-network',
  });

  const user = data?.getProfileByUsername?.items[0]?.user;

  return {
    user,
    loading,
    error,
  };
};

export default useUserByName;
