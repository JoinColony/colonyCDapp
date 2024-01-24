import { useAppContext } from '~context/AppContext';
import { User } from '~types/graphql';

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
