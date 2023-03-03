import { useFormContext } from 'react-hook-form';
import {
  SLIDER_AMOUNT_KEY,
  useStakingWidgetContext,
} from '~common/ColonyActions/ActionDetailsPage/DefaultMotion/MotionPhaseWidget/StakingWidget';
import RaiseObjectionDialog from '~common/Dialogs/motions/RaiseObjectionDialog';
import useColonyContext from '~hooks/useColonyContext';
import { useDialog } from '~shared/Dialog';
import { mapStakingSliderProps } from './helpers';

const useObjectButton = () => {
  const { colony } = useColonyContext();
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
    motionId,
    setMotionStakes,
    setUsersStakes,
  } = useStakingWidgetContext();
  const { watch } = useFormContext();
  const sliderAmount = watch(SLIDER_AMOUNT_KEY);

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

  const raiseObjectionDialogProps = {
    motionId,
    setIsSummary,
    setMotionStakes,
    setUsersStakes,
    defaultSliderAmount: sliderAmount,
    colonyAddress: colony?.colonyAddress ?? '',
  };

  const handleObjection = () =>
    totalNAYStakes.isZero()
      ? openRaiseObjectionDialog({
          stakingSliderProps,
          raiseObjectionDialogProps,
        })
      : setIsSummary(true);

  return { handleObjection, disabled: !canUserStakeNay };
};

export default useObjectButton;
