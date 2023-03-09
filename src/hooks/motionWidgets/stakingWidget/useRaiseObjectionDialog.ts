import { BigNumber } from 'ethers';

import {
  getFinalStake,
  useStakingWidgetContext,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import { useAppContext, useColonyContext } from '~hooks';
import { mapPayload } from '~utils/actions';

const useRaiseObjectionDialog = () => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const {
    maxUserStake,
    requiredStake,
    totalNAYStakes,
    minUserStake,
    motionId,
  } = useStakingWidgetContext();

  const remainingToFullyNayStaked = requiredStake.sub(totalNAYStakes);

  const transform = mapPayload(({ amount, annotationMessage }) => {
    const finalStake = getFinalStake(
      amount,
      remainingToFullyNayStaked,
      minUserStake,
      maxUserStake,
    );

    return {
      amount: finalStake,
      userAddress: user?.walletAddress,
      colonyAddress: colony?.colonyAddress,
      motionId: BigNumber.from(motionId),
      vote: 0,
      annotationMessage,
    };
  });

  const handleSuccess = () => {};
  //     (_, { setFieldValue, resetForm }) => {
  //       resetForm({});
  //       setFieldValue('amount', 0);
  //       scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
  //       close();
  //     },
  //   );

  return { transform, handleSuccess };
};

export default useRaiseObjectionDialog;
