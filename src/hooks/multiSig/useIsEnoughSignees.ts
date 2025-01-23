import { type ColonyRole } from '@colony/colony-js';

import { getDomainIdsForEligibleSignees } from '~utils/multiSig/index.ts';

import { useDomainThreshold } from './useDomainThreshold.ts';
import { useEligibleSignees } from './useEligibleSignees.ts';

interface UseIsEnoughSigneesParams {
  requiredRoles: ColonyRole[];
  permissionDomainId: number;
  thresholdDomainId: number;
}
interface UseIsEnoughSigneesResult {
  isEnoughSignees: boolean;
  isLoading: boolean;
}
export const useIsEnoughSignees = ({
  permissionDomainId,
  thresholdDomainId,
  requiredRoles,
}: UseIsEnoughSigneesParams): UseIsEnoughSigneesResult => {
  const { thresholdPerRole, isLoading: isDomainThresholdLoading } =
    useDomainThreshold({
      domainId: thresholdDomainId,
      requiredRoles,
    });

  const { countPerRole, isLoading: areEligibleSigneesLoading } =
    useEligibleSignees({
      domainIds: getDomainIdsForEligibleSignees(permissionDomainId),
      requiredRoles,
    });

  const isLoading = isDomainThresholdLoading || areEligibleSigneesLoading;

  if (!thresholdPerRole || !requiredRoles || isLoading) {
    return {
      isEnoughSignees: true,
      isLoading,
    };
  }

  const isEnoughSignees = requiredRoles.every(
    (role) => countPerRole[role] >= thresholdPerRole[role],
  );

  return {
    isEnoughSignees,
    isLoading,
  };
};
