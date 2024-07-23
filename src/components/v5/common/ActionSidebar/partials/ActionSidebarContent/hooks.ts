import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { type Action } from '~constants/actions.ts';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { useEligibleSignees } from '~hooks/multiSig/useEligibleSignees.ts';
import useFlatFormErrors from '~hooks/useFlatFormErrors.ts';
import { DecisionMethod } from '~types/actions.ts';
import { uniqBy } from '~utils/lodash.ts';

import { getPermissionsNeededForAction } from '../../hooks/permissions/helpers.ts';
import { REPUTATION_VALIDATION_FIELD_NAME } from '../../hooks/useReputationValidation.ts';

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

// @TODO somehow rework this so we don't always fetch it, but only call the business logic if decision method is multisig
export const useHasEnoughMembersWithPermissions = ({
  decisionMethod,
  selectedAction,
  createdIn,
}: {
  decisionMethod: DecisionMethod;
  selectedAction: Action;
  createdIn: number;
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
      domainId: createdIn,
      requiredRoles: multiSigRoles,
    });

  const { countPerRole, isLoading: areEligibleSigneesLoading } =
    useEligibleSignees({
      domainId: createdIn,
      requiredRoles: multiSigRoles,
    });

  if (
    decisionMethod !== DecisionMethod.MultiSig ||
    !thresholdPerRole ||
    !requiredRoles
  ) {
    return {
      hasEnoughMembersWithPermissions: true,
      isLoading: false,
    };
  }

  const hasEnoughMembersWithPermissions = requiredRoles.some((roles) =>
    roles.every((role) => countPerRole[role] >= thresholdPerRole[role]),
  );

  return {
    hasEnoughMembersWithPermissions,
    isLoading: isDomainThresholdLoading || areEligibleSigneesLoading,
  };
};
