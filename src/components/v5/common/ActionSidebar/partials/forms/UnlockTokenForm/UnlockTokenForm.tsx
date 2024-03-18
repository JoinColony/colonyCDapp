import React, { type FC } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { TX_SEARCH_PARAM } from '~routes/index.ts';

import { type ActionFormBaseProps } from '../../../types.ts';
import CreatedIn from '../../CreatedIn/index.ts';
import DecisionMethodField from '../../DecisionMethodField/index.ts';
import Description from '../../Description/index.ts';

import { useUnlockToken } from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.UnlockTokenForm';

const UnlockTokenForm: FC<ActionFormBaseProps> = ({ getFormOptions }) => {
  const { colony } = useColonyContext();
  const isNativeTokenUnlocked = !!colony.status?.nativeToken?.unlocked;
  const [searchParams] = useSearchParams();
  const transactionId = searchParams?.get(TX_SEARCH_PARAM);

  useUnlockToken(getFormOptions);

  return isNativeTokenUnlocked && !transactionId ? null : (
    <>
      <DecisionMethodField />
      <CreatedIn readonly />
      <Description />
    </>
  );
};

UnlockTokenForm.displayName = displayName;

export default UnlockTokenForm;
