import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~gql';
import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';

import { getHasActionPermissions } from './helpers.ts';

const useHasActionPermissions = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const form = useFormContext();

  const actionType = form.watch(ACTION_TYPE_FIELD_NAME);
  const decisionMethod = form.watch(DECISION_METHOD_FIELD_NAME);

  if (
    !actionType ||
    !decisionMethod ||
    decisionMethod === DecisionMethod.Reputation
  ) {
    return undefined;
  }

  const hasPermissions = getHasActionPermissions({
    colony,
    userAddress: user?.walletAddress ?? '',
    actionType,
    form,
  });

  if (decisionMethod === DecisionMethod.Permissions) {
    return hasPermissions;
  }

  const hasMultiSigPermissions = getHasActionPermissions({
    colony,
    userAddress: user?.walletAddress ?? '',
    actionType,
    form,
    isMultiSig: true,
  });

  if (decisionMethod === DecisionMethod.MultiSig) {
    return hasMultiSigPermissions;
  }

  return hasPermissions || hasMultiSigPermissions;
};

export default useHasActionPermissions;
