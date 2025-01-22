import { useFormContext } from 'react-hook-form';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~types/actions.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

import { getHasActionPermissions } from './helpers.ts';

const useHasActionPermissions = () => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { data } = useActionSidebarContext();

  const { action } = data;
  const { watch } = useFormContext();
  const formValues = watch();

  const { [DECISION_METHOD_FIELD_NAME]: decisionMethod } = formValues;
  if (
    !action ||
    !decisionMethod ||
    decisionMethod === DecisionMethod.Reputation ||
    decisionMethod === DecisionMethod.Staking
  ) {
    return undefined;
  }

  const hasPermissions = getHasActionPermissions({
    colony,
    userAddress: user?.walletAddress ?? '',
    actionType: action,
    formValues,
  });

  if (decisionMethod === DecisionMethod.Permissions) {
    return hasPermissions;
  }

  const hasMultiSigPermissions = getHasActionPermissions({
    colony,
    userAddress: user?.walletAddress ?? '',
    actionType: action,
    formValues,
    isMultiSig: true,
  });

  if (decisionMethod === DecisionMethod.MultiSig) {
    return hasMultiSigPermissions;
  }

  return hasPermissions || hasMultiSigPermissions;
};

export default useHasActionPermissions;
