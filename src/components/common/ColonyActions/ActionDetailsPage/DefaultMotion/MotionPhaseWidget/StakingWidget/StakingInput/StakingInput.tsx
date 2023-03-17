import React from 'react';
import { InferType, number, object } from 'yup';

import { ActionHookForm as ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';

import StakingControls from './StakingControls';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget';

export const SLIDER_AMOUNT_KEY = 'amount';

const validationSchema = object({
  [SLIDER_AMOUNT_KEY]: number().defined(),
}).defined();

export type StakingWidgetValues = InferType<typeof validationSchema>;

const StakingInput = () => {
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
      // transform={transform}
      // onSuccess={handleSuccess}
    >
      {/* <SliderDescription isObjection={isObjection} />
      {showAnnotation && (
        <SliderAnnotation
          enoughTokens={enoughTokens}
          requiredStakeMessageProps={requiredStakeMessageProps}
        />
      )}
      <StakingWidgetSlider
        {...stakingWidgetSliderProps}
        setLimitExceeded={setLimitExceeded}
      />
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
