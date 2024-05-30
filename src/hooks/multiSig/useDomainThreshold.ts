// disabling rule due to filters having snake case
/* eslint-disable camelcase */
import { ColonyRole, Extension } from '@colony/colony-js';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useGetColonyRolesQuery, type ModelColonyRoleFilterInput } from '~gql';
import useExtensionData from '~hooks/useExtensionData.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

interface UseDomainThresholdParams {
  domainId: string;
  requiredRole: ColonyRole;
}

interface UseDomainThresholdResult {
  threshold: number | null;
  isLoading: boolean;
}

// We assume that if a user has a role, they also have all of the roles "below"
const getRoleFilter = (
  role: ColonyRole,
): Partial<ModelColonyRoleFilterInput> => {
  switch (role) {
    case ColonyRole.Recovery:
      return { role_0: { eq: true } };
    case ColonyRole.Root:
      return { role_1: { eq: true } };
    case ColonyRole.Arbitration:
      return { role_2: { eq: true } };
    case ColonyRole.Architecture:
      return { role_3: { eq: true } };
    case ColonyRole.Funding:
      return { role_5: { eq: true } };
    case ColonyRole.Administration:
      return { role_6: { eq: true } };
    default:
      return {};
  }
};

export const useDomainThreshold = ({
  requiredRole,
  domainId,
}: UseDomainThresholdParams): UseDomainThresholdResult => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { extensionData, loading: loadingExtension } = useExtensionData(
    Extension.MultisigPermissions,
  );

  const { loading: loadingRoles, data: rolesData } = useGetColonyRolesQuery({
    variables: {
      filter: {
        colonyAddress: { eq: colonyAddress },
        isMultiSig: { eq: true },
        domainId: { eq: domainId },
        ...getRoleFilter(requiredRole),
      },
    },
  });

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
        thresholdEntry.domainId === domainId.toString(),
    );

    // if we didn't find domain config, let's just assume we inherit from the colony
    const thresholdConfig =
      matchingDomain !== undefined && matchingDomain !== null
        ? matchingDomain.domainThreshold
        : colonyThreshold;

    // if it's not majority approval
    if (thresholdConfig > 0) {
      return thresholdConfig;
    }

    if (loadingRoles || rolesData === undefined) {
      return null;
    }

    const numberOfPermissionHolders =
      rolesData.listColonyRoles?.items.length ?? 0;

    if (numberOfPermissionHolders === 0) {
      console.warn('There are no multiSig permission holders');

      return null;
    }

    const majority = Math.ceil(numberOfPermissionHolders / 2);

    return majority;
  };

  return {
    threshold: getDomainThreshold(),
    isLoading: loadingExtension || loadingRoles,
  };
};
