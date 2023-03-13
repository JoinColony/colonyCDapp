import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useDialogActionPermissions } from '~hooks';
import { Colony } from '~types';
import { noMotionsVotingReputationVersion } from '~utils/colonyMotions';
import { EnabledExtensionData } from './useEnabledExtensions';

const useActionDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  requiredRolesDomains: number[],
  enabledExtensionData: EnabledExtensionData,
  requiredRepDomain?: number,
) => {
  const {
    formState: { isValid, isSubmitting },
    getValues,
  } = useFormContext();
  const values = getValues();

  const { isVotingReputationEnabled, votingReputationVersion } =
    enabledExtensionData;

  const [userHasPermission, canOnlyForceAction] = useDialogActionPermissions(
    colony,
    isVotingReputationEnabled,
    requiredRoles,
    requiredRolesDomains,
    requiredRepDomain,
  );
  const disabledInput =
    !userHasPermission || canOnlyForceAction || isSubmitting;
  const disabledSubmit = disabledInput || !isValid;

  const canCreateMotion =
    votingReputationVersion !== noMotionsVotingReputationVersion ||
    values.forceAction;

  return {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    canCreateMotion,
    canOnlyForceAction,
  };
};

export default useActionDialogStatus;
