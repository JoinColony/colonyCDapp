import { BigNumber } from 'ethers';
import { number, object, ObjectSchema, string } from 'yup';
import { useAppContext, useColonyContext } from '~hooks';
import { useUserTokenBalanceContext } from '~context';

import { getHandleStakeSuccessFn, getStakingTransformFn } from './helpers';
import { StakingFormValues } from './types';

export const useStakingInput = (
  motionId,
  setIsRefetching,
  startPollingAction,
) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { pollLockedTokenBalance } = useUserTokenBalanceContext();

  const validationSchema: ObjectSchema<StakingFormValues> = object({
    amount: string()
      .required()
      .test('amount-test', 'test', (value) => {
        if (!value) {
          return false;
        }

        try {
          const amount = BigNumber.from(value);

          return amount.gt(0);
        } catch {
          return false;
        }
      }),
    voteType: number().required(),
  }).defined();

  const transform = getStakingTransformFn(
    user?.walletAddress ?? '',
    colony?.colonyAddress ?? '',
    motionId,
    colony?.nativeToken?.decimals,
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
