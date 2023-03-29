import React from 'react';
import { InferType, number, object } from 'yup';
import { BigNumber } from 'ethers';

import { ActionHookForm as ActionForm } from '~shared/Fields';
import { Action, ActionTypes } from '~redux';
import { mapPayload } from '~utils/actions';
import { MotionVote } from '~utils/colonyMotions';
import { useAppContext, useColonyContext } from '~hooks';

import { useStakingWidgetContext, getStakeFromSlider } from '..';
import {
  StakingControls,
  StakingSliderDescription,
  StakingSliderAnnotation,
  StakingWidgetSlider,
} from '.';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget';

export const SLIDER_AMOUNT_KEY = 'amount';

const validationSchema = object({
  [SLIDER_AMOUNT_KEY]: number().defined(),
}).defined();

export type StakingWidgetValues = InferType<typeof validationSchema>;
type StakeMotionPayload = Action<ActionTypes.MOTION_STAKE>['payload'];

const StakingInput = () => {
  // const handleSuccess = (_, { setFieldValue, resetForm }) => {
  //     resetForm({});
  //     setFieldValue('amount', 0);
  //     scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
  //   },

  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const {
    motionId,
    remainingStakes: [nayRemaining, yayRemaining],
    userMinStake,
  } = useStakingWidgetContext();
  const isObjection = false;
  const remainingToStake = isObjection ? nayRemaining : yayRemaining;
  const vote = isObjection ? MotionVote.Nay : MotionVote.Yay;

  const transform = mapPayload(({ amount: sliderAmount }) => {
    const finalStake = getStakeFromSlider(
      sliderAmount,
      remainingToStake,
      userMinStake,
    );

    return {
      amount: finalStake,
      userAddress: user?.walletAddress,
      colonyAddress: colony?.colonyAddress,
      motionId: BigNumber.from(motionId),
      vote,
    } as StakeMotionPayload;
  });

  return (
    <ActionForm<StakingWidgetValues>
      defaultValues={{
        [SLIDER_AMOUNT_KEY]: 0,
      }}
      validationSchema={validationSchema}
      actionType={ActionTypes.MOTION_STAKE}
      transform={transform}
      // onSuccess={handleSuccess}
    >
      <StakingSliderDescription isObjection={false} />
      {remainingToStake !== '0' && <StakingSliderAnnotation />}
      <StakingWidgetSlider />
      {/*
      {showValidationMessage && (
        <StakingValidationMessage
          {...stakingValidationMessageProps}
          limitExceeded={limitExceeded}
          minUserStake={minUserStake}
          maxUserStake={maxUserStake}
        />
      )} */}
      <StakingControls />
    </ActionForm>
  );
};

StakingInput.displayName = displayName;

export default StakingInput;
