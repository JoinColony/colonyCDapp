import { type ColonyRole, Extension } from '@colony/colony-js';

import useExtensionData from '~hooks/useExtensionData.ts';
import { type Threshold } from '~types/multiSig.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import { useEligibleSignees } from './useEligibleSignees.ts';

interface UseDomainThresholdParams {
  domainId: number;
  requiredRoles: ColonyRole[];
}

interface UseDomainThresholdResult {
  thresholdPerRole: Threshold;
  isLoading: boolean;
}

export const useDomainThreshold = ({
  requiredRoles,
  domainId,
}: UseDomainThresholdParams): UseDomainThresholdResult => {
  const { extensionData, loading: loadingExtension } = useExtensionData(
    Extension.MultisigPermissions,
  );

  // for majority approval we just want users in the afflicted domain
  const { countPerRole, isLoading: loadingEligibleSignees } =
    useEligibleSignees({
      domainIds: [domainId],
      requiredRoles,
    });

  const getDomainThreshold = (): Threshold => {
    if (loadingExtension || loadingEligibleSignees || !requiredRoles) {
      return null;
    }

    if (extensionData === null || !isInstalledExtensionData(extensionData)) {
      return null;
    }

    const { colonyThreshold, domainThresholds } =
      extensionData.params?.multiSig || {};

    if (colonyThreshold === undefined) {
      console.warn('MultiSig extension is not properly configured.');
      return null;
    }

    const matchingDomain = (domainThresholds ?? []).find(
      (thresholdEntry) =>
        thresholdEntry !== null &&
        thresholdEntry.domainId === domainId.toString(),
    );

    // if we didn't find domain config, let's just assume we inherit from the colony
    const thresholdConfig =
      matchingDomain !== undefined && matchingDomain !== null
        ? matchingDomain.domainThreshold
        : colonyThreshold;

    // if it's not majority approval
    if (thresholdConfig > 0) {
      const thresholdMap: { [role: number]: number } = {};

      // Iterate over each array of roles in requiredRoles
      requiredRoles.forEach((role) => {
        // Assign the thresholdConfig to each role in the current roles array
        thresholdMap[role] = thresholdConfig;
      });

      return thresholdMap;
    }

    // if there are no members, the default is still 1
    const thresholdPerRole = Object.entries(countPerRole).reduce(
      (acc, [role, count]) => {
        acc[role] = count ? Math.floor(count / 2) + 1 : 1;
        return acc;
      },
      {},
    );

    return thresholdPerRole;
  };

  return {
    thresholdPerRole: getDomainThreshold(),
    isLoading: loadingExtension,
  };
};
