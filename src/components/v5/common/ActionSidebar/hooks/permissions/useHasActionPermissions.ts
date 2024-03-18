import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~types/actions.ts';

import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '../../consts.ts';

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
  if (!actionType || decisionMethod !== DecisionMethod.Permissions) {
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
