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

export const useShowNotEnoughMembersWithPermissionsNotification = ({
  decisionMethod,
  selectedAction,
  createdIn,
}: {
  decisionMethod: DecisionMethod;
  selectedAction: Action;
  createdIn?: number;
}) => {
  const { watch } = useFormContext();
  const formValues = watch();

  const requiredRoles = getPermissionsNeededForAction(
    selectedAction,
    formValues,
  );

  const { threshold } = useDomainThreshold({
    domainId: createdIn,
    requiredRoles,
  });

  const { eligibleSigneesCount } = useEligibleSignees({
    domainId: createdIn,
    requiredRoles,
  });

  const hasEnoughMembersWithPermissions =
    threshold && eligibleSigneesCount >= threshold;

  const showNotEnoughMembersWithPermissionsNotification =
    decisionMethod === DecisionMethod.MultiSig &&
    !hasEnoughMembersWithPermissions;

  return showNotEnoughMembersWithPermissionsNotification;
};
