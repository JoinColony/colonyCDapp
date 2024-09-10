import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import AmountRow from '~v5/common/ActionSidebar/partials/AmountRow/AmountRow.tsx';
import CreatedIn from '~v5/common/ActionSidebar/partials/CreatedIn/index.ts';
import DecisionMethodField from '~v5/common/ActionSidebar/partials/DecisionMethodField/index.ts';
import Description from '~v5/common/ActionSidebar/partials/Description/index.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { useMintToken } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.MintTokenForm';

const MintTokenForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
  useMintToken(getFormOptions);

  return (
    <>
      <AmountRow
        title={formatText({ id: 'actionSidebar.value' })}
        tooltips={{
          label: {
            tooltipContent: formatText({
              id: 'actionSidebar.tooltip.mintTokens.amount',
            }),
          },
        }}
      />
      <DecisionMethodField />
      <CreatedIn readonly />
      <Description />
    </>
  );
};

MintTokenForm.displayName = displayName;

export default MintTokenForm;
