import React, { type FC } from 'react';

import ActionFormLayout from '~v5/common/ActionSidebar/partials/ActionFormLayout/ActionFormLayout.tsx';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { useIsFieldDisabled } from '~v5/common/ActionSidebar/partials/hooks.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { useCreateDecision } from './hooks.ts';
import SaveDraftButton from './partials/SaveDraftButton/SaveDraftButton.tsx';

const displayName = 'v5.common.ActionSidebar.CreateDecisionForm';

const CreateDecisionForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
  const isFieldDisabled = useIsFieldDisabled();

  useCreateDecision(getFormOptions);

  return (
    <ActionFormLayout extraActionButtons={<SaveDraftButton />}>
      <DecisionMethodField disabled={isFieldDisabled} reputationOnly />
      <CreatedIn />
      <Description />
    </ActionFormLayout>
  );
};

CreateDecisionForm.displayName = displayName;

export default CreateDecisionForm;
