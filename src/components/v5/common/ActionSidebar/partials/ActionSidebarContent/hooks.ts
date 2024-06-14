import { Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { type Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useDomainThreshold } from '~hooks/multiSig/useDomainThreshold.ts';
import { useEligibleSignees } from '~hooks/multiSig/useEligibleSignees.ts';
import useFlatFormErrors from '~hooks/useFlatFormErrors.ts';
import { DecisionMethod } from '~types/actions.ts';
import { uniqBy } from '~utils/lodash.ts';
import { getMultiSigRequiredRole } from '~utils/multiSig.ts';

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
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const requiredRole = getMultiSigRequiredRole(selectedAction);

  const domainId = `${colonyAddress}_${createdIn ?? Id.RootDomain}`;

  const { threshold } = useDomainThreshold({
    domainId,
    requiredRole,
  });

  const { eligibleSigneesCount } = useEligibleSignees({
    domainId,
    requiredRole,
  });

  const hasEnoughMembersWithPermissions =
    threshold && eligibleSigneesCount >= threshold;

  const showNotEnoughMembersWithPermissionsNotification =
    decisionMethod === DecisionMethod.MultiSig &&
    !hasEnoughMembersWithPermissions;

  return showNotEnoughMembersWithPermissionsNotification;
};
