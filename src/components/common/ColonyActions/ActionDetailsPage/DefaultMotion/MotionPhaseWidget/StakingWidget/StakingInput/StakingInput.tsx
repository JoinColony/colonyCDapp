import React from 'react';
import { InferType, number, object } from 'yup';

import { ActionHookForm as ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { useStakingInput } from '~hooks';

import { StakingControls, StakingSlider } from '.';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget';

export const SLIDER_AMOUNT_KEY = 'amount';

const validationSchema = object({
  [SLIDER_AMOUNT_KEY]: number().defined(),
}).defined();

export type StakingWidgetValues = InferType<typeof validationSchema>;

const StakingInput = () => {
  const { transform, handleSuccess, isObjection } = useStakingInput();

  return (
    <ActionForm<StakingWidgetValues>
      defaultValues={{
        [SLIDER_AMOUNT_KEY]: 0,
      }}
      validationSchema={validationSchema}
      actionType={ActionTypes.MOTION_STAKE}
      transform={transform}
      onSuccess={handleSuccess}
    >
      <StakingSlider isObjection={isObjection} />
      <StakingControls />
    </ActionForm>
  );
};

StakingInput.displayName = displayName;

export default StakingInput;
