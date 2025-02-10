import React, { type FC } from 'react';

import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { useIsFieldDisabled } from '~v5/common/ActionSidebar/partials/hooks.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import { useCreateArbitraryTxs } from './hooks.ts';
import ArbitraryTransactionsTable from './partials/ArbitraryTransactionsTable/ArbitraryTransactionsTable.tsx';

const displayName = 'v5.common.ActionSidebar.partials.ArbitraryTxsForm';

const ArbitraryTxsForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const isFieldDisabled = useIsFieldDisabled();

  useCreateArbitraryTxs(getFormOptions);

  return (
    <>
      <DecisionMethodField disabled={isFieldDisabled} />
      <CreatedIn readonly />
      <Description disabled={isFieldDisabled} />
      <ArbitraryTransactionsTable
        name="transactions"
        disabled={isFieldDisabled}
      />
    </>
  );
};

ArbitraryTxsForm.displayName = displayName;

export default ArbitraryTxsForm;
