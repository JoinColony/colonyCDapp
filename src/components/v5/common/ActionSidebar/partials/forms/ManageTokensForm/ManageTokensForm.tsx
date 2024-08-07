import React, { type FC } from 'react';

import useHasNoDecisionMethods from '../../../hooks/permissions/useHasNoDecisionMethods.ts';
import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

import { useManageTokens } from './hooks.ts';
import TokensTable from './partials/TokensTable/TokensTable.tsx';

const displayName = 'v5.common.ActionSidebar.partials.ManageTokensForm';

const ManageTokensForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { shouldShowMenu } = useManageTokens(getFormOptions);

  const hasNoDecisionMethods = useHasNoDecisionMethods();

  return (
    <>
      <DecisionMethodField />
      <CreatedIn readonly />
      <Description />
      <TokensTable
        name="selectedTokenAddresses"
        shouldShowMenu={shouldShowMenu}
        isDisabled={hasNoDecisionMethods}
      />
    </>
  );
};

ManageTokensForm.displayName = displayName;

export default ManageTokensForm;
