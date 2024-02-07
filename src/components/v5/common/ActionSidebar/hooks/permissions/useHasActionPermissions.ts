import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { DecisionMethod } from '~types/actions.ts';

import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '../../consts.tsx';

import { getHasActionPermissions } from './helpers.ts';

export const useHasActionPermissions = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const { watch } = useFormContext();
  const formValues = watch();

  const {
    [ACTION_TYPE_FIELD_NAME]: actionType,
    [DECISION_METHOD_FIELD_NAME]: decisionMethod,
  } = formValues;
  if (!actionType || decisionMethod === DecisionMethod.Reputation) {
    return undefined;
  }

  const hasPermissions = getHasActionPermissions(
    colony,
    user?.walletAddress ?? '',
    actionType,
    formValues,
  );

  return hasPermissions;
};
