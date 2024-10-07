import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { type CoreActionOrGroup } from '~actions/index.ts';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { useEligibleSignees } from '~hooks/multiSig/useEligibleSignees.ts';
import { getDomainIdsForEligibleSignees } from '~utils/multiSig/index.ts';
import { getPermissionsNeededForAction } from '~v5/common/ActionSidebar/hooks/permissions/helpers.ts';

interface UseHasEnoughMembersWithPermissionsResult {
  hasEnoughMembersWithPermissions: boolean;
  isLoading: boolean;
}

export const useHasEnoughMembersWithPermissions = ({
  selectedAction,
  permissionDomainId,
  thresholdDomainId,
}: {
  selectedAction: CoreActionOrGroup;
  // domainId to check users if they have permissions in
  permissionDomainId: number;
  // domainId to check the threshold
  thresholdDomainId: number;
}): UseHasEnoughMembersWithPermissionsResult => {
  const { watch } = useFormContext();
  const formValues = watch();

  const requiredRoles = useMemo(
    () => getPermissionsNeededForAction(selectedAction, formValues) || [],
    [selectedAction, formValues],
  );

  /*
   * This may seem like a hack, but for display purposes, we always fetch all possible roles
   * The only action where this can break is managing permissions in a subdomain via permissions, not via multisig, so we are good
   */
  const multiSigRoles = requiredRoles.flat();

  const { thresholdPerRole, isLoading: isDomainThresholdLoading } =
    useDomainThreshold({
      domainId: thresholdDomainId,
      requiredRoles: multiSigRoles,
    });

  const { countPerRole, isLoading: areEligibleSigneesLoading } =
    useEligibleSignees({
      domainIds: getDomainIdsForEligibleSignees(permissionDomainId),
      requiredRoles: multiSigRoles,
    });

  const isLoading = isDomainThresholdLoading || areEligibleSigneesLoading;

  if (!thresholdPerRole || !requiredRoles) {
    return {
      hasEnoughMembersWithPermissions: true,
      isLoading,
    };
  }

  const hasEnoughMembersWithPermissions = requiredRoles.some((roles) =>
    roles.every((role) => countPerRole[role] >= thresholdPerRole[role]),
  );

  return {
    hasEnoughMembersWithPermissions,
    isLoading,
  };
};
