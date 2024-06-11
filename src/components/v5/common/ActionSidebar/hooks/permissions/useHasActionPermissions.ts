import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { DecisionMethod } from '~types/actions.ts';

import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '../../consts.ts';

import { getHasActionPermissions } from './helpers.ts';

const useHasActionPermissions = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const { isMultiSigEnabled } = useEnabledExtensions();

  const { watch } = useFormContext();
  const formValues = watch();

  const {
    [ACTION_TYPE_FIELD_NAME]: actionType,
    [DECISION_METHOD_FIELD_NAME]: decisionMethod,
  } = formValues;
  if (
    !actionType ||
    (!isMultiSigEnabled && decisionMethod !== DecisionMethod.Permissions) ||
    (isMultiSigEnabled && decisionMethod !== DecisionMethod.MultiSig)
  ) {
    return undefined;
  }

  const hasPermissions = getHasActionPermissions({
    colony,
    userAddress: user?.walletAddress ?? '',
    actionType,
    formValues,
  });

  if (decisionMethod === DecisionMethod.Permissions) {
    return hasPermissions;
  }

  const hasMultiSigPermissions = getHasActionPermissions({
    colony,
    userAddress: user?.walletAddress ?? '',
    actionType,
    formValues,
    isMultiSig: true,
  });

  if (decisionMethod === DecisionMethod.MultiSig) {
    return hasMultiSigPermissions;
  }

  return hasPermissions || hasMultiSigPermissions;
};

export default useHasActionPermissions;
