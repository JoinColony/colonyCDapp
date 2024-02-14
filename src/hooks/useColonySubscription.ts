import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { apolloClient } from '~apollo';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import {
  useCreateColonyContributorMutation,
  useGetColonyContributorQuery,
  useRemoveMemberFromColonyWhitelistMutation,
  useUpdateColonyContributorMutation,
} from '~gql';
import { CREATE_PROFILE_ROUTE } from '~routes/index.ts';
import { type Colony } from '~types/graphql.ts';
import { getColonyContributorId } from '~utils/members.ts';
import { handleNewUser } from '~utils/newUser.ts';

import { useCanJoinColony } from './useCanInteractWithColony.ts';

const useColonySubscription = (colony?: Colony) => {
  const { colonyAddress = '' } = colony ?? {};
  const { user, wallet, connectWallet } = useAppContext();
  const { walletAddress = '' } = user || {};

  const [removeMemberFromColonyWhitelist] =
    useRemoveMemberFromColonyWhitelistMutation();

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

  const clearContributorCaches = () => {
    apolloClient.cache.evict({ fieldName: 'getContributorsByAddress' });
    apolloClient.cache.evict({ fieldName: 'getColonyContributor' });
  };

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
    clearContributorCaches();
  };

  const handleUnwatch = async () => {
    await updateContributor({
      variables: { input: { id: colonyContributorId, isWatching: false } },
      onCompleted(data) {
        setIsWatching(Boolean(data?.updateColonyContributor?.isWatching));
      },
    });
    clearContributorCaches();

    // @BETA: Remove once beta ends
    await removeMemberFromColonyWhitelist({
      variables: {
        input: {
          colonyAddress,
          userAddress: walletAddress,
        },
      },
    });
    navigate('/');
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
