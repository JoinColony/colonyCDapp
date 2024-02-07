import React, { type FC } from 'react';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';
import { useIsFieldDisabled } from '../../hooks.ts';

import { useCreateDecision } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.SinglePaymentForm';

const CreateDecisionForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const isFieldDisabled = useIsFieldDisabled();

  useCreateDecision(getFormOptions);

  return (
    <>
      <DecisionMethodField disabled={isFieldDisabled} reputationOnly />
      <CreatedInRow disabled={isFieldDisabled} />
      <DescriptionRow disabled={isFieldDisabled} />
    </>
  );
};

CreateDecisionForm.displayName = displayName;

export default CreateDecisionForm;
