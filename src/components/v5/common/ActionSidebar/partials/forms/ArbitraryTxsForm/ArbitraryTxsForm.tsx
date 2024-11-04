import React, { type FC } from 'react';

import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { useIsFieldDisabled } from '~v5/common/ActionSidebar/partials/hooks.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

const displayName = 'v5.common.ActionSidebar.partials.SinglePaymentForm';

const ArbitraryTxsForm: FC<ActionFormBaseProps> = () => {
  const isFieldDisabled = useIsFieldDisabled();

  return (
    <>
      <DecisionMethodField disabled={isFieldDisabled} />
      <CreatedIn />
      <Description />
    </>
  );
};

ArbitraryTxsForm.displayName = displayName;

export default ArbitraryTxsForm;
