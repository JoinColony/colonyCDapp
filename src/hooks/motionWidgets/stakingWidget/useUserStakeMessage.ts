import { useStakingWidgetContext } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';

const useUserStakeMessage = () => {
  const { userStake, requiredStake, nativeTokenSymbol, nativeTokenDecimals } =
    useStakingWidgetContext();

  const userStakePercentage = userStake
    .div(requiredStake.isZero() ? '1' : requiredStake)
    .mul(100);

  const formattedUserStakePercentage = userStakePercentage.toDP(2).toString();

  return {
    formattedUserStakePercentage,
    userStake,
    nativeTokenSymbol,
    nativeTokenDecimals,
  };
};

export default useUserStakeMessage;
