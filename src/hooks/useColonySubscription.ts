import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useCreateColonyContributorMutation,
  useGetColonyContributorQuery,
  useUpdateColonyContributorMutation,
} from '~gql';
import { useAppContext, useCanJoinColony } from '~hooks';
import { CREATE_PROFILE_ROUTE } from '~routes';
import { Colony } from '~types';
import { getColonyContributorId } from '~utils/members';
import { handleNewUser } from '~utils/newUser';

const useColonySubscription = (colony?: Colony) => {
  const { colonyAddress = '' } = colony ?? {};
  const { user, wallet, connectWallet } = useAppContext();
  const { walletAddress = '' } = user || {};

  const [isWatching, setIsWatching] = useState(false);

  const navigate = useNavigate();

  const colonyContributorId = getColonyContributorId(
    colonyAddress,
    walletAddress,
  );

  const { data: initialData, loading } = useGetColonyContributorQuery({
    variables: { id: colonyContributorId, colonyAddress },
    skip: !colonyAddress || !walletAddress,
    onCompleted(data) {
      setIsWatching(Boolean(data?.getColonyContributor?.isWatching));
    },
  });

  const isAlreadyContributor = !!initialData?.getColonyContributor;

  /* Watch a Colony */
  const [createContributor] = useCreateColonyContributorMutation({
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
    onCompleted: () => setIsWatching(true),
  });

  /* Update a Colony Contributor */
  const [updateContributor] = useUpdateColonyContributorMutation();

  const handleWatch = () => {
    if (user) {
      if (!isAlreadyContributor) {
        createContributor();
      } else {
        updateContributor({
          variables: { input: { id: colonyContributorId, isWatching: true } },
          onCompleted(data) {
            setIsWatching(Boolean(data?.updateColonyContributor?.isWatching));
          },
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
      onCompleted(data) {
        setIsWatching(Boolean(data?.updateColonyContributor?.isWatching));
      },
    });
  };

  const canWatch = useCanJoinColony(isWatching, colony) && !loading;

  return {
    canWatch,
    isWatching,
    handleWatch,
    handleUnwatch,
  };
};

export default useColonySubscription;
