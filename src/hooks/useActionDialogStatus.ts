import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { useColonyHasReputation, useDialogActionPermissions } from '~hooks';
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
    watch,
  } = useFormContext();
  const forceAction = watch('forceAction');

  const { isVotingReputationEnabled, votingReputationVersion } =
    enabledExtensionData;

  const hasReputation = useColonyHasReputation(
    colony.colonyAddress,
    requiredRepDomain,
  );

  const [userHasPermission, canOnlyForceAction] = useDialogActionPermissions(
    colony,
    isVotingReputationEnabled,
    requiredRoles,
    requiredRolesDomains,
    hasReputation,
  );

  const canCreateMotion = isVotingReputationEnabled && hasReputation;
  const hasMotionCompatibleVersion =
    votingReputationVersion !== noMotionsVotingReputationVersion || forceAction;

  const disabledInput =
    (!userHasPermission && !canCreateMotion) ||
    canOnlyForceAction ||
    isSubmitting;
  const disabledSubmit = disabledInput || !isValid;
  const showPermissionErrors = !userHasPermission && !isVotingReputationEnabled;

  return {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    canCreateMotion,
    canOnlyForceAction,
    hasMotionCompatibleVersion,
    showPermissionErrors,
  };
};

export default useActionDialogStatus;
