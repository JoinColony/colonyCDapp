import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import { defineMessages } from 'react-intl';
import { number, object, type ObjectSchema, string } from 'yup';

import { useAppContext } from '~context/AppContext.tsx';
import { useUserTokenBalanceContext } from '~context/UserTokenBalanceContext.tsx';
import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import { useMotionContext } from '../../../../partials/MotionProvider/hooks.ts';

import { getHandleStakeSuccessFn, getStakingTransformFn } from './helpers.ts';
import { type StakingFormValues } from './types.ts';

const MSG = defineMessages({
  amountRequired: {
    id: 'v5.common.ActionSidebar.Motions.StakingStep.StakingForm.amountRequired',
    defaultMessage: 'A stake amount is required',
  },
  lessThanRemaining: {
    id: 'v5.common.ActionSidebar.Motions.StakingStep.StakingForm.lessThanRemaining',
    defaultMessage: "You can't stake more than remaining stake",
  },
  moreThanBalance: {
    id: 'v5.common.ActionSidebar.Motions.StakingStep.StakingForm.moreThanBalance',
    defaultMessage: "You can't stake more than your balance",
  },
});

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
  const userAvailableTokens = BigNumber.from(
    tokenBalanceData?.activeBalance ?? 0,
  ).add(tokenBalanceData?.inactiveBalance ?? 0);

  const validationSchema: ObjectSchema<StakingFormValues> = object()
    .shape({
      amount: string()
        .test(
          'amount-more-than-zero',
          formatText(MSG.amountRequired),
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
          formatText(MSG.lessThanRemaining),
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
        .test(
          'amount-more-than-balance',
          formatText(MSG.moreThanBalance),
          (value) => {
            if (!value) {
              return false;
            }

            try {
              const amount = BigNumber.from(
                moveDecimal(value, getTokenDecimalsWithFallback(tokenDecimals)),
              );

              return amount.lte(userAvailableTokens);
            } catch {
              return false;
            }
          },
        )
        .required(formatText(MSG.amountRequired)),
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
