import { ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import { AnimatePresence, motion } from 'framer-motion';
import moveDecimal from 'move-decimal-point';
import React, { type FC } from 'react';

import { STAKING_THRESHOLD } from '~constants';
import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { usePageThemeContext } from '~context/PageThemeContext/PageThemeContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { MotionVote } from '~utils/colonyMotions.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { useMotionContext } from '~v5/common/ActionSidebar/partials/Motions/partials/MotionProvider/hooks.ts';
import FormFormattedInput from '~v5/common/Fields/InputBase/FormFormattedInput.tsx';
import FormButtonRadioButtons from '~v5/common/Fields/RadioButtons/ButtonRadioButtons/FormButtonRadioButtons.tsx';
import Button from '~v5/shared/Button/index.ts';

import StakingChart from '../StakingChart/StakingChart.tsx';

import { getMaxStakeAmount, getPredictedPercentage } from './helpers.ts';
import { useStakingForm } from './hooks.ts';
import { type StakingFormProps, type StakingFormValues } from './types.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep.partials.StakingForm';

const StakingForm: FC<StakingFormProps> = ({
  userActivatedTokens,
  userInactivatedTokens,
  disableForm,
}) => {
  const {
    action: { colony },
    motionData,
  } = useMotionContext();
  const { isDarkMode } = usePageThemeContext();

  const { nativeToken } = colony || {};
  const { nativeTokenDecimals, nativeTokenSymbol: tokenSymbol = '' } =
    nativeToken || {};
  const tokenDecimals = getTokenDecimalsWithFallback(nativeTokenDecimals);

  const { requiredStake, motionStakes, remainingStakes } = motionData;

  const [opposeRemaining, supportRemaining] = remainingStakes || [];

  const userAvailableBalance = BigNumber.from(userActivatedTokens).add(
    userInactivatedTokens,
  );

  const { handleSuccess, transform, validationSchema, isRefetching } =
    useStakingForm();

  const { percentage } = motionStakes;
  const { nay, yay } = percentage;
  const objectingStakesPercentageValue = Number(nay) || 0;
  const supportingStakesPercentageValue = Number(yay) || 0;

  const isFullySupported = supportingStakesPercentageValue === 100;
  const isFullyObjected = objectingStakesPercentageValue === 100;

  return (
    <ActionForm<StakingFormValues>
      defaultValues={
        {
          // amount: '0', // Disable default value
        }
      }
      validationSchema={validationSchema}
      onSuccess={handleSuccess}
      transform={transform}
      actionType={ActionTypes.MOTION_STAKE}
    >
      {({ formState: { isSubmitting, isValid }, getValues, setValue }) => {
        const voteTypeValue = getValues('voteType');
        const amountValue = getValues('amount');

        const predictedPercentage = getPredictedPercentage({
          voteTypeValue,
          amount: amountValue,
          tokenDecimals,
          supportRemaining,
          opposeRemaining,
        });

        return (
          <>
            <StakingChart
              requiredStake={requiredStake}
              tokenDecimals={tokenDecimals}
              tokenSymbol={tokenSymbol}
              chartProps={{
                threshold:
                  supportingStakesPercentageValue < STAKING_THRESHOLD
                    ? STAKING_THRESHOLD
                    : undefined,
                percentageVotesAgainst: objectingStakesPercentageValue,
                percentageVotesFor: supportingStakesPercentageValue,
                predictPercentageVotesAgainst:
                  voteTypeValue === MotionVote.Nay
                    ? predictedPercentage
                    : undefined,
                predictPercentageVotesFor:
                  voteTypeValue === MotionVote.Yay
                    ? predictedPercentage
                    : undefined,
                ...(!disableForm && { className: 'mb-6' }),
              }}
            />
            <div>
              {!disableForm && (
                <FormButtonRadioButtons
                  name="voteType"
                  allowUnselect={!isFullySupported && !isFullyObjected}
                  items={[
                    {
                      label: formatText({ id: 'motion.oppose' }),
                      id: 'oppose',
                      value: MotionVote.Nay,
                      className: (checked, disabled) =>
                        clsx({
                          'border-negative-300 text-gray-900 [&_.icon]:text-negative-400':
                            !checked && !disabled,
                          'border-gray-300 text-gray-300 [&_.icon]:text-gray-300':
                            disabled,
                          'border-negative-400 bg-negative-400 text-base-white':
                            checked && !disabled && !isDarkMode,
                          'border-negative-400 bg-negative-400 text-gray-900':
                            checked && !disabled && isDarkMode,
                        }),
                      icon: ThumbsDown,
                      disabled: isSubmitting || isFullyObjected || isRefetching,
                    },
                    {
                      label: formatText({ id: 'motion.support' }),
                      id: 'support',
                      value: MotionVote.Yay,
                      className: (checked, disabled) =>
                        clsx({
                          'border-purple-200 text-gray-900 [&_.icon]:text-purple-400':
                            !checked && !disabled,
                          'border-gray-300 text-gray-300 [&_.icon]:text-gray-300':
                            disabled,
                          'border-purple-400 bg-purple-400 text-base-white':
                            checked && !disabled && !isDarkMode,
                          'border-purple-400 bg-purple-400 text-gray-900':
                            checked && !disabled && isDarkMode,
                        }),
                      icon: ThumbsUp,
                      disabled:
                        isSubmitting || isFullySupported || isRefetching,
                    },
                  ]}
                  disabled={disableForm}
                />
              )}
            </div>
            <AnimatePresence>
              {voteTypeValue !== undefined && (
                <motion.div
                  key="accordion-content"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={accordionAnimation}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="mt-6"
                >
                  <label
                    htmlFor="amount-field"
                    className="mb-2 flex flex-wrap items-center justify-between gap-x-4"
                  >
                    <span className="text-gray-900 text-1">
                      {formatText({ id: 'motion.staking.input.label' })}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatText(
                        { id: 'motion.staking.input.balance' },
                        {
                          balance: (
                            <Numeral
                              value={userAvailableBalance}
                              suffix={` ${tokenSymbol}`}
                              decimals={tokenDecimals}
                            />
                          ),
                        },
                      )}
                    </span>
                  </label>
                  <FormFormattedInput
                    id="amount-field"
                    name="amount"
                    placeholder="0"
                    options={{
                      numeralDecimalScale:
                        getTokenDecimalsWithFallback(tokenDecimals),
                      numeralPositiveOnly: true,
                      tailPrefix: true,
                    }}
                    buttonProps={{
                      label: formatText({ id: 'button.max' }),
                      onClick: () => {
                        setValue(
                          'amount',
                          moveDecimal(
                            getMaxStakeAmount(
                              voteTypeValue,
                              userAvailableBalance,
                              remainingStakes,
                            ),
                            -tokenDecimals,
                          ),
                          {
                            shouldTouch: true,
                            shouldValidate: true,
                            shouldDirty: true,
                          },
                        );
                      },
                    }}
                    wrapperClassName="mb-6"
                  />
                  <Button
                    isFullSize
                    disabled={isSubmitting || !isValid || isRefetching}
                    type="submit"
                  >
                    {formatText({ id: 'motion.staking.button.submit' })}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );
      }}
    </ActionForm>
  );
};

StakingForm.displayName = displayName;

export default StakingForm;
