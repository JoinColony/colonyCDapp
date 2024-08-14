import React, { type FC } from 'react';

import ColonyDetailsFields from '~v5/common/ActionSidebar/partials/ColonyDetailsFields/index.ts';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import { useEditColonyDetails } from './hooks.ts';
import SocialLinksTable from './partials/SocialLinksTable/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.EditColonyDetailsForm';

const EditColonyDetailsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useEditColonyDetails(getFormOptions);

  return (
    <>
      <ColonyDetailsFields />
      <DecisionMethodField />
      <CreatedIn readonly />
      <Description />
      <SocialLinksTable name="externalLinks" />
    </>
  );
};

EditColonyDetailsForm.displayName = displayName;

export default EditColonyDetailsForm;
