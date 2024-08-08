import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';

import { type CreateActionFormProps } from '../../../types.ts';
import AmountRow from '../../AmountRow/AmountRow.tsx';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

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
