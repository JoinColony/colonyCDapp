import { useFormContext } from 'react-hook-form';

import { type Action } from '~constants/actions.ts';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { useEligibleSignees } from '~hooks/multiSig/useEligibleSignees.ts';
import useFlatFormErrors from '~hooks/useFlatFormErrors.ts';
import { DecisionMethod } from '~types/actions.ts';
import { uniqBy } from '~utils/lodash.ts';
import { REPUTATION_VALIDATION_FIELD_NAME } from '~v5/common/ActionSidebar/hooks/useReputationValidation.ts';

import { getPermissionsNeededForAction } from '../../hooks/permissions/helpers.ts';

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

export const useHasEnoughMembersWithPermissions = ({
  decisionMethod,
  selectedAction,
  createdIn,
}: {
  decisionMethod: DecisionMethod;
  selectedAction: Action;
  createdIn: number;
}) => {
  const { watch } = useFormContext();
  const formValues = watch();

  const requiredRoles = getPermissionsNeededForAction(
    selectedAction,
    formValues,
  );

  const { thresholdPerRole } = useDomainThreshold({
    domainId: createdIn,
    requiredRoles,
  });

  const { countPerRole } = useEligibleSignees({
    domainId: createdIn,
    requiredRoles,
  });

  if (
    decisionMethod !== DecisionMethod.MultiSig ||
    !thresholdPerRole ||
    !requiredRoles
  ) {
    return true;
  }

  const hasEnoughMembersWithPermissions = requiredRoles.every(
    (role) => countPerRole[role] >= thresholdPerRole[role],
  );

  return hasEnoughMembersWithPermissions;
};
