import { useGetMotionStateQuery } from '~gql';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { motionTags } from '~shared/Tag';
import { MotionData } from '~types';
import { MotionState, getMotionState } from '~utils/colonyMotions';

const getMotionTag = (
  networkMotionState: number | null | undefined,
  isMotion: boolean | null | undefined,
  motionData: MotionData | null | undefined,
) => {
  // If not motion, then forced action
  if (!isMotion) {
    return motionTags.Forced;
  }

  if (networkMotionState && motionData) {
    return motionTags[getMotionState(networkMotionState, motionData)];
  }

  // If no motion state / data, display as invalid
  return motionTags.Invalid;

  // @TODO: handle case where motion is from now-uninstalled voting rep version.
};

export const useMotionStatusDisplay = (
  isMotion: boolean | null | undefined,
  motionData: MotionData | null | undefined,
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
        motionId: Number(motionData?.motionId),
      },
    },
  });
  const networkMotionState = motionStateData?.getMotionState;

  const showMotionTag = !loadingMotionState && isVotingReputationEnabled;
  const MotionTag = showMotionTag ? getMotionTag(networkMotionState, isMotion, motionData) : () => null;

  const motionState =
    networkMotionState && motionData
      ? getMotionState(networkMotionState, motionData)
      : MotionState.Invalid;

  const showMotionCountdownTimer =
    motionState !== MotionState.Passed &&
    motionState !== MotionState.Failed &&
    motionState !== MotionState.FailedNotFinalizable &&
    motionState !== MotionState.Invalid;

  return {
    motionState,
    MotionTag,
    showMotionCountdownTimer,
    refetchMotionState,
  };
};
