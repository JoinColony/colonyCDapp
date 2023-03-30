import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  GetFullColonyByNameDocument,
  useCreateWatchedColoniesMutation,
  useDeleteWatchedColoniesMutation,
} from '~gql';
import { CREATE_USER_ROUTE } from '~routes';
import { useAppContext, useColonyContext } from '~hooks';
import { getWatchedColony } from '~utils/watching';
import { handleNewUser } from '~utils/newUser';

const useColonySubscription = () => {
  const { colony, canInteractWithColony } = useColonyContext();
  const {
    user,
    updateUser,
    wallet,
    walletConnecting,
    connectWallet,
    userLoading,
  } = useAppContext();
  const navigate = useNavigate();

  const watchedItem = getWatchedColony(colony, user?.watchlist?.items);

  /* Watch (follow) a colony */
  const [watch, { data: watchData }] = useCreateWatchedColoniesMutation({
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
  });

  /* Unwatch (unfollow) a colony */
  const [unwatch, { data: unwatchData }] = useDeleteWatchedColoniesMutation({
    variables: { input: { id: watchedItem?.id || '' } },
    refetchQueries: [
      {
        query: GetFullColonyByNameDocument,
        variables: { name: colony?.name },
      },
    ],
  });

  /* Update user on watch/unwatch */
  useEffect(() => {
    if (updateUser) {
      updateUser(user?.walletAddress);
    }
  }, [user, updateUser, watchData, unwatchData]);

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

  const canWatch = !canInteractWithColony && !walletConnecting && !userLoading;

  return {
    canWatch,
    handleWatch,
    unwatch,
  };
};

export default useColonySubscription;
