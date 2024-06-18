import { type ColonyRole, Extension } from '@colony/colony-js';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import { useEligibleSignees } from './useEligibleSignees.ts';

interface UseDomainThresholdParams {
  domainId?: number;
  requiredRoles?: ColonyRole[];
}

interface UseDomainThresholdResult {
  threshold: number | null;
  isLoading: boolean;
}

export const useDomainThreshold = ({
  requiredRoles,
  domainId,
}: UseDomainThresholdParams): UseDomainThresholdResult => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { extensionData, loading: loadingExtension } = useExtensionData(
    Extension.MultisigPermissions,
  );

  const { eligibleSigneesCount } = useEligibleSignees({
    domainId,
    requiredRoles,
  });

  const thresholdMultiplier = requiredRoles ? requiredRoles.length : 1;

  const getDomainThreshold = (): number | null => {
    if (loadingExtension) {
      return null;
    }

    if (extensionData === null || !isInstalledExtensionData(extensionData)) {
      console.warn('MultiSig extension is not installed');

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
        thresholdEntry.domainId === `${colonyAddress}_${domainId}`,
    );

    // if we didn't find domain config, let's just assume we inherit from the colony
    const thresholdConfig =
      matchingDomain !== undefined && matchingDomain !== null
        ? matchingDomain.domainThreshold
        : colonyThreshold;

    // if it's not majority approval
    if (thresholdConfig > 0) {
      return thresholdConfig * thresholdMultiplier;
    }

    const numberOfPermissionHolders = eligibleSigneesCount;

    if (numberOfPermissionHolders === 0) {
      console.warn('There are no multiSig permission holders');

      return null;
    }

    const majority = Math.ceil(numberOfPermissionHolders / 2);

    return majority * thresholdMultiplier;
  };

  return {
    threshold: getDomainThreshold(),
    isLoading: loadingExtension,
  };
};
