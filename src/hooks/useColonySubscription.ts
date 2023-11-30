import { useNavigate } from 'react-router-dom';

import {
  useCreateColonyContributorMutation,
  useGetColonyContributorQuery,
  useUpdateColonyContributorMutation,
} from '~gql';
import { CREATE_PROFILE_ROUTE } from '~routes';
import { useAppContext, useCanJoinColony, useColonyContext } from '~hooks';
import { handleNewUser } from '~utils/newUser';
import { getColonyContributorId } from '~utils/members';

const useColonySubscription = () => {
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony ?? {};
  const { user, wallet, connectWallet } = useAppContext();
  const { walletAddress = '' } = user || {};

  const navigate = useNavigate();

  const colonyContributorId = getColonyContributorId(
    colonyAddress,
    walletAddress,
  );

  const { data, loading } = useGetColonyContributorQuery({
    variables: { id: colonyContributorId, colonyAddress },
    skip: !colonyAddress || !walletAddress,
  });

  const isAlreadyContributor = !!data?.getColonyContributor;

  /* Watch a Colony */
  const [createContributor, { data: creationData }] =
    useCreateColonyContributorMutation({
      variables: {
        input: {
          colonyAddress,
          colonyReputationPercentage: 0,
          contributorAddress: walletAddress,
          isVerified: false,
          id: getColonyContributorId(colonyAddress, walletAddress),
          isWatching: true,
        },
      },
    });

  /* Update a Colony Contributor */
  const [updateContributor, { data: updateData }] =
    useUpdateColonyContributorMutation();

  const handleWatch = () => {
    if (user) {
      if (!isAlreadyContributor) {
        createContributor();
      } else {
        updateContributor({
          variables: { input: { id: colonyContributorId, isWatching: true } },
        });
      }
    } else if (wallet && !user) {
      handleNewUser();
      // TO Do: update to new user modal
      navigate(CREATE_PROFILE_ROUTE);
    } else {
      connectWallet();
    }
  };

  const handleUnwatch = () => {
    updateContributor({
      variables: { input: { id: colonyContributorId, isWatching: false } },
    });
  };

  const isWatchingColony = Boolean(
    data?.getColonyContributor?.isWatching ||
      creationData?.createColonyContributor?.isWatching ||
      updateData?.updateColonyContributor?.isWatching,
  );

  const canWatch = useCanJoinColony(isWatchingColony) && !loading;

  return {
    canWatch,
    handleWatch,
    handleUnwatch,
  };
};

export default useColonySubscription;
