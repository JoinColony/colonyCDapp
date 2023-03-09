import { useStakingWidgetContext } from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import RaiseObjectionDialog from '~common/Dialogs/motions/RaiseObjectionDialog';
import { useDialog } from '~shared/Dialog';
import { mapStakingSliderProps } from './helpers';

const useObjectButton = () => {
  const {
    canUserStakeNay,
    remainingToFullyNayStaked,
    minUserStake,
    userActivatedTokens,
    totalNAYStakes,
    setIsSummary,
    maxUserStake,
    enoughTokens,
    getErrorType,
    nativeTokenDecimals,
    nativeTokenSymbol,
    reputationLoading,
    totalPercentage,
  } = useStakingWidgetContext();

  const openRaiseObjectionDialog = useDialog(RaiseObjectionDialog);

  const stakingSliderProps = mapStakingSliderProps({
    canBeStaked: canUserStakeNay,
    enoughTokens,
    getErrorType,
    isObjection: true,
    maxUserStake,
    minUserStake,
    nativeTokenDecimals,
    nativeTokenSymbol,
    remainingToStake: remainingToFullyNayStaked,
    reputationLoading,
    totalPercentage,
    userActivatedTokens,
  });

  const handleObjection = () =>
    totalNAYStakes.isZero()
      ? openRaiseObjectionDialog({ stakingSliderProps })
      : setIsSummary(true);

  return { handleObjection, disabled: !canUserStakeNay };
};

export default useObjectButton;
