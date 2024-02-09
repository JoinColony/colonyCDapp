import React, { type FC } from 'react';

import ColonyDetailsFields from '~v5/common/ActionSidebar/partials/ColonyDetailsFields/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

import { useEditColonyDetails } from './hooks.ts';
import SocialLinksTable from './partials/SocialLinksTable/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.EditColonyDetailsForm';

const EditColonyDetailsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useEditColonyDetails(getFormOptions);

  return (
    <>
      <ColonyDetailsFields />
      <DecisionMethodField />
      <CreatedIn />
      <Description />
      <SocialLinksTable name="externalLinks" />
    </>
  );
};

EditColonyDetailsForm.displayName = displayName;

export default EditColonyDetailsForm;
