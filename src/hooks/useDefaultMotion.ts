import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useUpdateMotionStateMutation } from '~gql';
import { getMotionState, MotionState } from '~utils/colonyMotions';

import { useRequiredStake } from './motionWidgets';
import useAppContext from './useAppContext';
import useColonyContext from './useColonyContext';
import useEnabledExtensions from './useEnabledExtensions';

const useDefaultMotion = (motionId?: string) => {
  const { transactionHash } = useParams();
  const { colony } = useColonyContext();
  const { user, userLoading } = useAppContext();
  const {
    enabledExtensions: { isVotingReputationEnabled },
  } = useEnabledExtensions();

  const [
    updateMotion,
    {
      called: mutationHasBeenFired,
      data: updatedMotionData,
      loading: loadingMotion,
    },
  ] = useUpdateMotionStateMutation({
    variables: {
      input: {
        colonyAddress: colony?.colonyAddress ?? '',
        motionId: Number(motionId),
        transactionHash: transactionHash ?? '',
      },
    },
  });

  if (!mutationHasBeenFired && user) {
    updateMotion();
  }

  const updatedMotion = updatedMotionData?.updateMotionState;
  const motionData = updatedMotion?.motionData;

  const stakesUnder10Percent =
    Number(motionData?.motionStakes.percentage.yay) +
      Number(motionData?.motionStakes.percentage.nay) <
    10;

  const [showBanner, setShowBanner] = useState(stakesUnder10Percent);
  const { requiredStake } = useRequiredStake(motionData?.skillRep ?? '0');

  const [motionState, setMotionState] = useState<MotionState>(
    MotionState.Invalid,
  );

  if (motionState === MotionState.Invalid && motionData) {
    const newMotionState = getMotionState(motionData, requiredStake.toString());
    setMotionState(newMotionState);
  }

  return {
    showMotionHeading: isVotingReputationEnabled,
    showBanner,
    setShowBanner,
    colony,
    updateMotion,
    updatedMotion,
    motionState,
    setMotionState,
    loadingMotion: loadingMotion || userLoading,
  };
};

export default useDefaultMotion;
