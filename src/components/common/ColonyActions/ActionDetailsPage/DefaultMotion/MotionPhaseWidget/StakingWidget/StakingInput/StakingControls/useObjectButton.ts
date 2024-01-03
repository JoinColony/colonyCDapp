import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { RaiseObjectionDialog } from '~common/Dialogs';
import { useUserTokenBalanceContext } from '~context';
import { useAppContext, useColonyContext } from '~hooks';
import { useDialog } from '~shared/Dialog';
import { MotionVote } from '~utils/colonyMotions';

import { useStakingWidgetContext } from '../../StakingWidgetProvider';
import { getHandleStakeSuccessFn, getStakingTransformFn } from '../helpers';
import { SLIDER_AMOUNT_KEY } from '../StakingInput';

const useObjectButton = () => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { pollLockedTokenBalance } = useUserTokenBalanceContext();
  const { transactionHash } = useParams();

  const { getValues } = useFormContext();
  const openRaiseObjectionDialog = useDialog(RaiseObjectionDialog);
  const {
    remainingStakes: [nayRemaining],
    userMinStake,
    motionId,
    isDecision,
    setIsSummary,
    setIsRefetching,
    startPollingAction,
  } = useStakingWidgetContext();

  const transform = getStakingTransformFn(
    nayRemaining,
    userMinStake,
    user?.walletAddress ?? '',
    colony?.colonyAddress ?? '',
    motionId,
    MotionVote.Nay,
    transactionHash,
  );

  const handleStakeSuccess = getHandleStakeSuccessFn(
    setIsRefetching,
    startPollingAction,
    pollLockedTokenBalance,
  );

  const handleObjection = () =>
    openRaiseObjectionDialog({
      transform,
      handleStakeSuccess,
      setIsSummary,
      amount: getValues(SLIDER_AMOUNT_KEY),
      isDecision,
    });

  return { handleObjection };
};

export default useObjectButton;
