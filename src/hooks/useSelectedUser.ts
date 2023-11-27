import { User } from '~types';
import useAppContext from './useAppContext';

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
