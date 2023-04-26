import { useGetMotionStateQuery } from '~gql';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { motionTags } from '~shared/Tag';
import { Address, MotionData } from '~types';
import { MotionState, getMotionState } from '~utils/colonyMotions';

export const useColonyMotionState = (
  isMotion: boolean | null | undefined,
  motionData: MotionData | null | undefined,
  transactionHash: Address,
) => {
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const { data: motionStateData, refetch: refetchMotionState } =
    useGetMotionStateQuery({
      skip: !isMotion || !motionData || !colony || !isVotingReputationEnabled,
      variables: {
        input: {
          colonyAddress: colony?.colonyAddress ?? '',
          transactionHash,
        },
      },
      fetchPolicy: 'cache-and-network',
    });
  const networkMotionState = motionStateData?.getMotionState;

  const motionState =
    networkMotionState !== undefined && motionData
      ? getMotionState(networkMotionState, motionData)
      : null;

  return { motionState, refetchMotionState };
};

export const useMotionTag = (
  isMotion: boolean | null | undefined,
  motionState: MotionState | null,
) => {
  const { isVotingReputationEnabled } = useEnabledExtensions();

  // If not motion, then forced action
  if (!isMotion && isVotingReputationEnabled) {
    return motionTags.Forced;
  }

  if (motionState) {
    return motionTags[motionState];
  }

  // If no motion state, or voting rep is not enabled, don't show a motion tag.
  return () => null;
};
