import React, { type FC } from 'react';

import ColonyDetailsFields from '~v5/common/ActionSidebar/partials/ColonyDetailsFields/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';

import { useEditColonyDetails } from './hooks.ts';
import SocialLinksTable from './partials/SocialLinksTable/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.EditColonyDetailsForm';

const EditColonyDetailsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  useEditColonyDetails(getFormOptions);

  return (
    <>
      <ColonyDetailsFields />
      <DecisionMethodField />
      <CreatedInRow />
      <DescriptionRow />
      <SocialLinksTable name="externalLinks" />
    </>
  );
};

EditColonyDetailsForm.displayName = displayName;

export default EditColonyDetailsForm;
