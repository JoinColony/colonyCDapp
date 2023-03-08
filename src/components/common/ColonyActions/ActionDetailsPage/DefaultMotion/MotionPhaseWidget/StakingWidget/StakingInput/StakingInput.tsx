import React from 'react';
import { InferType, number, object } from 'yup';

import { ActionHookForm as ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { useStakingInput } from '~hooks';

import StakingSlider from '../StakingSlider';
import StakingControls from './StakingControls';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget';

export const SLIDER_AMOUNT_KEY = 'amount';

const validationSchema = object({
  [SLIDER_AMOUNT_KEY]: number().defined(),
}).defined();

export type StakingWidgetValues = InferType<typeof validationSchema>;

const StakingInput = () => {
  const { transform, stakingSliderProps, limitExceeded } = useStakingInput();
  // const handleSuccess = (_, { setFieldValue, resetForm }) => {
  //     resetForm({});
  //     setFieldValue('amount', 0);
  //     scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
  //   },

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
      <StakingSlider {...stakingSliderProps} />
      <StakingControls limitExceeded={limitExceeded} />
    </ActionForm>
  );
};

StakingInput.displayName = displayName;

export default StakingInput;
