import { BigNumber } from 'ethers';
import { number, object, ObjectSchema, string } from 'yup';
import moveDecimal from 'move-decimal-point';

import { useAppContext } from '~hooks';
import { useUserTokenBalanceContext } from '~context';

import { StakingFormValues } from './types';
import { getHandleStakeSuccessFn, getStakingTransformFn } from './helpers';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useMotionContext } from '../../../../partials/MotionProvider/hooks';
import { MotionVote } from '~utils/colonyMotions';
import { formatText } from '~utils/intl';

export const useStakingForm = () => {
  const { user } = useAppContext();
  const { pollLockedTokenBalance, tokenBalanceData } =
    useUserTokenBalanceContext();
  const { motionAction, setIsRefetching, startPollingAction } =
    useMotionContext();

  const { token, colony, motionData } = motionAction || {};
  const { decimals } = token || {};
  const { nativeToken } = colony || {};
  const { nativeTokenDecimals, tokenAddress } = nativeToken || {};
  const tokenDecimals = decimals || nativeTokenDecimals || 0;

  const { motionId, remainingStakes } = motionData;
  const [opposeRemaining, supportRemaining] = remainingStakes || [];

  const validationSchema: ObjectSchema<StakingFormValues> = object()
    .shape({
      amount: string()
        .test(
          'amount-more-than-zero',
          formatText({ id: 'motion.staking.input.error.amountRequired' }),
          (value) => {
            if (!value) {
              return false;
            }

            try {
              const amount = BigNumber.from(
                moveDecimal(value, getTokenDecimalsWithFallback(tokenDecimals)),
              );

              return amount.gt(0);
            } catch {
              return false;
            }
          },
        )
        .test(
          'amount-less-than-remaining',
          formatText({ id: 'motion.staking.input.error.moreThanRemaining' }),
          (value, context) => {
            if (!value) {
              return false;
            }

            const remainingTokens =
              context.parent.voteType === MotionVote.Yay
                ? supportRemaining
                : opposeRemaining;

            try {
              const amount = BigNumber.from(
                moveDecimal(value, getTokenDecimalsWithFallback(tokenDecimals)),
              );

              return amount.lte(remainingTokens);
            } catch {
              return false;
            }
          },
        )
        .required(
          formatText({ id: 'motion.staking.input.error.amountRequired' }),
        ),
      voteType: number().required(),
    })
    .defined();

  const transform = getStakingTransformFn(
    user?.walletAddress ?? '',
    colony?.colonyAddress ?? '',
    motionId,
    tokenDecimals,
    tokenAddress,
    tokenBalanceData?.activeBalance ?? '0',
  );

  const handleSuccess = getHandleStakeSuccessFn(
    setIsRefetching,
    startPollingAction,
    pollLockedTokenBalance,
  );

  return {
    transform,
    handleSuccess,
    validationSchema,
  };
};
