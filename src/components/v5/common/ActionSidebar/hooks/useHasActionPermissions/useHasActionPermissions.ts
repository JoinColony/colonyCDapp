import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';

import { ACTION_TYPE_FIELD_NAME } from '../../consts.tsx';

import { getHasActionPermissions } from './helpers.ts';

/**
 * Hook determining if the user has the required permissions to perform an action
 * @param fullValidation if enabled, the check will take into account the form values
 * which are needed to determine the required permissions for some actions
 * @returns a boolean indicating if the user has the required permissions, or undefined if it cannot be determined
 */
export const useHasActionPermissions = (fullValidation?: boolean) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const { watch } = useFormContext();
  const formValues = watch();

  const actionType = formValues[ACTION_TYPE_FIELD_NAME];
  if (!actionType) {
    return undefined;
  }

  const hasPermissions = getHasActionPermissions(
    colony,
    user?.walletAddress ?? '',
    actionType,
    fullValidation ? formValues : {},
  );

  return hasPermissions;
};
