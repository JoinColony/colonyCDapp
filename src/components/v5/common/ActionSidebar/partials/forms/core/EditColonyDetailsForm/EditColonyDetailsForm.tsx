import React, { type FC } from 'react';

import ActionFormLayout from '~v5/common/ActionSidebar/partials/ActionFormLayout/ActionFormLayout.tsx';
import ColonyDetailsFields from '~v5/common/ActionSidebar/partials/ColonyDetailsFields/index.ts';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { useEditColonyDetails } from './hooks.ts';
import SocialLinksTable from './partials/SocialLinksTable/index.ts';

const displayName = 'v5.common.ActionSidebar.EditColonyDetailsForm';

const EditColonyDetailsForm: FC<CreateActionFormProps> = ({
  getFormOptions,
}) => {
  useEditColonyDetails(getFormOptions);

  return (
    <ActionFormLayout>
      <ColonyDetailsFields />
      <DecisionMethodField />
      <CreatedIn readonly />
      <Description />
      <SocialLinksTable name="externalLinks" />
    </ActionFormLayout>
  );
};

EditColonyDetailsForm.displayName = displayName;

export default EditColonyDetailsForm;
