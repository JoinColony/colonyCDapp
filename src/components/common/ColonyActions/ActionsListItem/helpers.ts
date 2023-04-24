import { useGetMotionStateQuery } from '~gql';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { motionTags } from '~shared/Tag';
import { Address, MotionData } from '~types';
import {
  MotionState,
  getMotionState,
  shouldDisplayMotionCountdownTime,
} from '~utils/colonyMotions';

const getMotionTag = (
  isMotion: boolean | null | undefined,
  motionState: MotionState,
) => {
  // If not motion, then forced action
  if (!isMotion) {
    return motionTags.Forced;
  }

  return motionTags[motionState];
  // @TODO: handle case where motion is from now-uninstalled voting rep version.
};

export const useMotionStatusDisplay = (
  isMotion: boolean | null | undefined,
  motionData: MotionData | null | undefined,
  transactionHash: Address,
) => {
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const { colony } = useColonyContext();

  const {
    data: motionStateData,
    loading: loadingMotionState,
    refetch: refetchMotionState,
  } = useGetMotionStateQuery({
    skip: !isMotion || !motionData || !colony,
    variables: {
      input: {
        colonyAddress: colony?.colonyAddress ?? '',
        transactionHash,
      },
    },
  });
  const networkMotionState = motionStateData?.getMotionState;

  const showMotionTag = !loadingMotionState && isVotingReputationEnabled;

  const motionState =
    networkMotionState && motionData
      ? getMotionState(networkMotionState, motionData)
      : MotionState.Invalid;

  const MotionTag = showMotionTag ? getMotionTag(isMotion, motionState) : () => null;

  const showMotionCountdownTimer =
    shouldDisplayMotionCountdownTime(motionState);

  return {
    motionState,
    MotionTag,
    showMotionCountdownTimer,
    refetchMotionState,
  };
};
