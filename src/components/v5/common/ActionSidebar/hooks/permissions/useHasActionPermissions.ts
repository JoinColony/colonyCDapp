import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~types/actions.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';

import { getHasActionPermissions } from './helpers.ts';

const useHasActionPermissions = () => {
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

  const hasPermissions = getHasActionPermissions({
    colony,
    userAddress: user?.walletAddress ?? '',
    actionType,
    formValues,
  });

  return hasPermissions;
};

export default useHasActionPermissions;
