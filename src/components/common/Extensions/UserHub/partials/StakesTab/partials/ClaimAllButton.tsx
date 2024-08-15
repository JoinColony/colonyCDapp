import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { type VotingReputationByColonyAddress } from '~hooks/useNetworkMotionStatesAllColonies.ts';
import { ActionTypes } from '~redux/index.ts';
import { type UserStakeWithStatus } from '~types/userStake.ts';

const displayName = 'common.Extensions.UserHub.partials.StakesTab';

interface ClaimAllButtonProps {
  claimableStakes: UserStakeWithStatus[];
  updateClaimedStakesCache: (stakesIds: string[]) => void;
  votingReputationByColony: VotingReputationByColonyAddress;
}

const ClaimAllButton = ({
  claimableStakes,
  votingReputationByColony,
  updateClaimedStakesCache,
}: ClaimAllButtonProps) => {
  const { formatMessage } = useIntl();

  const { user } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);

  const claimAll = useAsyncFunction({
    submit: ActionTypes.MOTION_CLAIM_ALL,
    error: ActionTypes.MOTION_CLAIM_ALL_ERROR,
    success: ActionTypes.MOTION_CLAIM_ALL_SUCCESS,
  });

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await claimAll({
        userAddress: user?.walletAddress ?? '',
        userStakes: claimableStakes.map((stake) => ({
          databaseMotionId: stake.action?.motionData?.databaseMotionId ?? '',
          colonyAddress: stake.action?.colonyAddress ?? '',
          extensionAddress:
            votingReputationByColony[stake.action?.colonyAddress ?? ''] ?? '',
        })),
      });
      updateClaimedStakesCache(claimableStakes.map((stake) => stake.id));
    } catch {
      //
    }

    setIsLoading(false);
  };

  if (!claimableStakes.length) {
    return null;
  }

  return (
    <button
      type="button"
      className="text-blue-400 transition-all duration-normal text-4 enabled:hover:text-gray-900 disabled:text-gray-900"
      aria-label={formatMessage({ id: 'claimStakes' })}
      disabled={isLoading}
      onClick={handleClick}
    >
      {formatMessage({ id: 'claimStakes' })}
    </button>
  );
};

ClaimAllButton.displayName = displayName;

export default ClaimAllButton;
