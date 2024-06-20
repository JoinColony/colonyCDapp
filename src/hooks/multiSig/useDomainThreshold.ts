import { type ColonyRole, Extension } from '@colony/colony-js';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import { useEligibleSignees } from './useEligibleSignees.ts';

interface UseDomainThresholdParams {
  domainId?: number;
  requiredRoles?: ColonyRole[];
}

type Threshold = { [role: number]: number } | null;

interface UseDomainThresholdResult {
  thresholdPerRole: Threshold;
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

  const { countPerRole } = useEligibleSignees({
    domainId,
    requiredRoles,
  });

  const getDomainThreshold = (): Threshold => {
    if (loadingExtension || !requiredRoles) {
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
      return requiredRoles.reduce((acc, role) => {
        acc[role] = thresholdConfig;
        return acc;
      }, {});
    }

    if (!Object.values(countPerRole).every((count) => count > 0)) {
      console.warn(
        'Not every required role has a member with multisig permissions',
      );
      return null;
    }

    const thresholdPerRole = Object.entries(countPerRole).reduce(
      (acc, [role, count]) => {
        acc[role] = Math.ceil(count / 2);
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
