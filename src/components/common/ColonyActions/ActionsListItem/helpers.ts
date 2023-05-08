import { useGetMotionStateQuery } from '~gql';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { motionTags } from '~shared/Tag';
import { Address, ColonyMotion } from '~types';
import { MotionState, getMotionState } from '~utils/colonyMotions';

export const useColonyMotionState = (
  isMotion: boolean | null | undefined,
  motionData: ColonyMotion | null | undefined,
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
          databaseMotionId: motionData?.databaseMotionId ?? '',
          transactionHash,
        },
      },
      fetchPolicy: 'cache-and-network',
    });
  const networkMotionState = motionStateData?.getMotionState;

  /*
   * We want a distinction between an invalid motion and a motion for which we don't currently have the motion state
   * (else we'll see invalid when the motion state is loading). Hence assigning to null, not MotionState.Invalid.
   */

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
