import { useNavigate } from 'react-router-dom';

import {
  GetFullColonyByNameDocument,
  useCreateColonyContributorMutation,
  useCreateWatchedColoniesMutation,
  useDeleteWatchedColoniesMutation,
  useGetColonyContributorQuery,
} from '~gql';
import { CREATE_USER_ROUTE } from '~routes';
import { useAppContext, useCanJoinColony, useColonyContext } from '~hooks';
import { getWatchedColony } from '~utils/watching';
import { handleNewUser } from '~utils/newUser';
import { getColonyContributorId } from '~utils/members';

const useColonySubscription = () => {
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony ?? {};
  const { user, updateUser, wallet, connectWallet } = useAppContext();
  const { walletAddress = '' } = user || {};

  const navigate = useNavigate();

  const watchedItem = getWatchedColony(colony, user?.watchlist?.items);
  const colonyContributorId = getColonyContributorId(
    colonyAddress,
    walletAddress,
  );

  const { data } = useGetColonyContributorQuery({
    variables: { id: colonyContributorId },
  });

  const isAlreadyContributor = !!data?.getColonyContributor;

  /* Watch (follow) a colony */
  const [watch] = useCreateWatchedColoniesMutation({
    variables: {
      input: {
        colonyID: colonyAddress,
        userID: walletAddress,
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

  /* Create a Colony Contributor */
  const [createContributor] = useCreateColonyContributorMutation({
    variables: {
      input: {
        colonyAddress,
        colonyReputationPercentage: 0,
        contributorAddress: walletAddress,
        verified: false,
        id: `${colonyAddress}_${walletAddress}`,
      },
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
      if (!isAlreadyContributor) {
        createContributor();
      }
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
