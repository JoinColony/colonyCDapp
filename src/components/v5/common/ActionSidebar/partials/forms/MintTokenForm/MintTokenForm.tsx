import React, { type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { formatText } from '~utils/intl.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import AmountRow from '../../AmountRow/AmountRow.tsx';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

import { useMintToken } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.MintTokenForm';

const MintTokenForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const {
    colony: { nativeToken },
  } = useColonyContext();

  useMintToken(getFormOptions);

  return (
    <>
      <AmountRow
        tokenAddress={nativeToken.tokenAddress}
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
