import React, { type FC } from 'react';

import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { useIsFieldDisabled } from '~v5/common/ActionSidebar/partials/hooks.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { useCreateDecision } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.SinglePaymentForm';

const CreateDecisionForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
  const isFieldDisabled = useIsFieldDisabled();

  useCreateDecision(getFormOptions);

  return (
    <>
      <DecisionMethodField disabled={isFieldDisabled} reputationOnly />
      <CreatedIn />
      <Description />
    </>
  );
};

CreateDecisionForm.displayName = displayName;

export default CreateDecisionForm;
