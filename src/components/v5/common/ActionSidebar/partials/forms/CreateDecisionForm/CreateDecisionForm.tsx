import React, { type FC } from 'react';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';
import { useIsFieldDisabled } from '../../hooks.ts';

import { useCreateDecision } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.SinglePaymentForm';

const CreateDecisionForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const isFieldDisabled = useIsFieldDisabled();

  useCreateDecision(getFormOptions);

  return (
    <>
      <DecisionMethodField disabled={isFieldDisabled} motionOnly />
      <CreatedIn />
      <Description />
    </>
  );
};

CreateDecisionForm.displayName = displayName;

export default CreateDecisionForm;
