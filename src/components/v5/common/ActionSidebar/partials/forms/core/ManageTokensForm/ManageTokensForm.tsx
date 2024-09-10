import React, { type FC } from 'react';

import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { useManageTokens } from './hooks.ts';
import TokensTable from './partials/TokensTable/TokensTable.tsx';

const displayName = 'v5.common.ActionSidebar.partials.ManageTokensForm';

const ManageTokensForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
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
