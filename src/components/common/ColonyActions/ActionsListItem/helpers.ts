import { useGetMotionStateQuery } from '~gql';
import { useColonyContext } from '~hooks';
import { motionTags } from '~shared/Tag';
import { MotionData } from '~types';
import { getMotionState } from '~utils/colonyMotions';

export const useMotionTag = (
  isMotion?: boolean | null,
  motionData?: MotionData | null,
) => {
  const { colony } = useColonyContext();
  const { data: motionStateData, loading: loadingMotionState } =
    useGetMotionStateQuery({
      skip: !isMotion || !motionData || !colony,
      variables: {
        input: {
          colonyAddress: colony?.colonyAddress ?? '',
          motionId: Number(motionData?.motionId),
        },
      },
    });

  const networkMotionState = motionStateData?.getMotionState;

  // No tag while loading motion state
  if (loadingMotionState) {
    return undefined;
  }

  // If not motion, then forced action
  if (!isMotion) {
    return motionTags.Forced;
  }

  if (networkMotionState && motionData) {
    return motionTags[getMotionState(networkMotionState, motionData)];
  }

  // If no motion state / data, display as invalid
  return motionTags.Invalid;

  // TODO: handle case where motion is from now-uninstalled voting rep version.
};
