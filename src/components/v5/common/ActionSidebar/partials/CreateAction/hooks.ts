import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { type Action } from '~constants/actions.ts';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { useEligibleSignees } from '~hooks/multiSig/useEligibleSignees.ts';
import useFlatFormErrors from '~hooks/useFlatFormErrors.ts';
import { uniqBy } from '~utils/lodash.ts';
import { getDomainIdsForEligibleSignees } from '~utils/multiSig/index.ts';
import { REPUTATION_VALIDATION_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import { getPermissionsNeededForAction } from '~v5/common/ActionSidebar/hooks/permissions/helpers.ts';

export const useGetFormActionErrors = () => {
  const {
    formState: { errors },
  } = useFormContext();
  const allFlatFormErrors = useFlatFormErrors(errors).filter(
    ({ key }) =>
      !['this', REPUTATION_VALIDATION_FIELD_NAME].includes(String(key)),
  );

  const flatFormErrors = uniqBy(allFlatFormErrors, 'message');

  return {
    flatFormErrors,
  };
};

interface UseHasEnoughMembersWithPermissionsResult {
  hasEnoughMembersWithPermissions: boolean;
  isLoading: boolean;
}

export const useHasEnoughMembersWithPermissions = ({
  selectedAction,
  permissionDomainId,
  thresholdDomainId,
}: {
  selectedAction: Action;
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

  if (!thresholdPerRole || !requiredRoles || isLoading) {
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
