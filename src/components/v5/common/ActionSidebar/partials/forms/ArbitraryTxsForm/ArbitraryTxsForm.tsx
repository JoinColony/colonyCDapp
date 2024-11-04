import React, { type FC } from 'react';

import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { useIsFieldDisabled } from '~v5/common/ActionSidebar/partials/hooks.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import ArbitraryTransactionsField from './partials/ArbitraryTransactionsField/index.ts';

const displayName = 'v5.common.ActionSidebar.partials.ArbitraryTxsForm';

const ArbitraryTxsForm: FC<ActionFormBaseProps> = () => {
  const isFieldDisabled = useIsFieldDisabled();

  return (
    <>
      <DecisionMethodField disabled={isFieldDisabled} />
      <CreatedIn />
      <Description />
      <ArbitraryTransactionsField />
    </>
  );
};

ArbitraryTxsForm.displayName = displayName;

export default ArbitraryTxsForm;
