import React from 'react';
import { InferType, number, object } from 'yup';
import { BigNumber } from 'ethers';

import { ActionHookForm as ActionForm } from '~shared/Fields';
import { Action, ActionTypes } from '~redux';
import { useStakingInput } from '~hooks';
import { mapPayload } from '~utils/actions';
import { MotionVote } from '~utils/colonyMotions';
import { useAppContext, useColonyContext } from '~hooks';

import { getStakeFromSlider } from '..';
import { StakingControls, StakingSlider } from '.';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget';

export const SLIDER_AMOUNT_KEY = 'amount';

const validationSchema = object({
  [SLIDER_AMOUNT_KEY]: number().defined(),
}).defined();

export type StakingWidgetValues = InferType<typeof validationSchema>;
type StakeMotionPayload = Action<ActionTypes.MOTION_STAKE>['payload'];

export const getStakingTransformFn = (
  remainingToStake: string,
  userMinStake: string,
  userAddress: string,
  colonyAddress: string,
  motionId: string,
  vote: number,
) =>
  mapPayload(({ amount: sliderAmount }) => {
    const finalStake = getStakeFromSlider(
      sliderAmount,
      remainingToStake,
      userMinStake,
    );

    return {
      amount: finalStake,
      userAddress,
      colonyAddress,
      motionId: BigNumber.from(motionId),
      vote,
    } as StakeMotionPayload;
  });

const StakingInput = () => {
  const { transform, handleSuccess, canBeStaked, isObjection } =
    useStakingInput();
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
      <StakingSlider canBeStaked={canBeStaked} isObjection={isObjection} />
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
