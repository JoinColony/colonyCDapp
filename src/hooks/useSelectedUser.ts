import { useAppContext } from '~context/AppContext.tsx';
import { User } from '~types/graphql.ts';

const useSelectedUser = (colonyUsers: User[]) => {
  const { user } = useAppContext();

  const [firstSubscriber, secondSubscriber] = colonyUsers;

  if (!secondSubscriber) {
    return firstSubscriber;
  }

  return firstSubscriber?.walletAddress === user?.walletAddress
    ? secondSubscriber
    : firstSubscriber;
};

export default useSelectedUser;
