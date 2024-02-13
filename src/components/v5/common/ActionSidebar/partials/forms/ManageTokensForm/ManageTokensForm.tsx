import React, { type FC } from 'react';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedInRow from '../../CreatedInRow/CreatedInRow.tsx';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import DescriptionRow from '../../DescriptionRow/index.ts';
import TokensTable from '../../TokensTable/index.ts';

import { useManageTokens } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.ManageTokensForm';

const ManageTokensForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { shouldShowMenu } = useManageTokens(getFormOptions);

  return (
    <>
      <DecisionMethodField />
      <CreatedInRow />
      <DescriptionRow />
      <TokensTable
        name="selectedTokenAddresses"
        shouldShowMenu={shouldShowMenu}
      />
    </>
  );
};

ManageTokensForm.displayName = displayName;

export default ManageTokensForm;
