import { useNavigate } from 'react-router-dom';

import {
  GetFullColonyByNameDocument,
  useCreateWatchedColoniesMutation,
  useDeleteWatchedColoniesMutation,
} from '~gql';
import { CREATE_USER_ROUTE } from '~routes';
import { useAppContext, useCanJoinColony, useColonyContext } from '~hooks';
import { getWatchedColony } from '~utils/watching';
import { handleNewUser } from '~utils/newUser';

const useColonySubscription = () => {
  const { colony } = useColonyContext();
  const { user, updateUser, wallet, connectWallet } = useAppContext();
  const navigate = useNavigate();

  const watchedItem = getWatchedColony(colony, user?.watchlist?.items);

  /* Watch (follow) a colony */
  const [watch] = useCreateWatchedColoniesMutation({
    variables: {
      input: {
        colonyID: colony?.colonyAddress || '',
        userID: user?.walletAddress || '',
      },
    },
    refetchQueries: [
      {
        query: GetFullColonyByNameDocument,
        variables: { name: colony?.name },
      },
    ],
    onCompleted() {
      updateUser?.(user?.walletAddress);
    },
  });

  /* Unwatch (unfollow) a colony */
  const [unwatch] = useDeleteWatchedColoniesMutation({
    variables: { input: { id: watchedItem?.id || '' } },
    refetchQueries: [
      {
        query: GetFullColonyByNameDocument,
        variables: { name: colony?.name },
      },
    ],
    onCompleted() {
      updateUser?.(user?.walletAddress);
    },
  });

  const handleWatch = () => {
    if (user) {
      watch();
    } else if (wallet && !user) {
      handleNewUser();
      // TO Do: update to new user modal
      navigate(CREATE_USER_ROUTE);
    } else {
      connectWallet?.();
    }
  };

  const canWatch = useCanJoinColony();

  return {
    canWatch,
    handleWatch,
    unwatch,
  };
};

export default useColonySubscription;
