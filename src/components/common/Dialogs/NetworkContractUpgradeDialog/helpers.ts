import { ColonyRole, Id } from '@colony/colony-js';

import { EnabledExtensionData, useActionDialogStatus } from '~hooks';
import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types';
// import { colonyCanBeUpgraded } from '~utils/checks';

export const getNetworkContractUpgradeDialogPayload = (
  { colonyAddress, version, name: colonyName }: Colony,
  { annotation: annotationMessage },
) => {
  return {
    operationName: RootMotionMethodNames.Upgrade,
    colonyAddress,
    colonyName,
    version,
    motionParams: [version + 1],
    annotationMessage,
  };
};

export const useNetworkContractUpgradeDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  enabledExtensionData: EnabledExtensionData,
) => {
  // const { version: newVersion } = useNetworkContracts();

  const {
    userHasPermission,
    disabledSubmit: defaultDisabledSubmit,
    disabledInput: defaultDisabledInput,
    canCreateMotion,
    canOnlyForceAction,
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

  // const canUpgradeVersion =
  //   userHasPermission && !!colonyCanBeUpgraded(colony, newVersion as string);

  // const {
  //   data,
  //   loading: loadingLegacyRecoveyRole,
  // } = useLegacyNumberOfRecoveryRolesQuery({
  //   variables: {
  //     colonyAddress,
  //   },
  // });

  const isLoadingLegacyRecoveryRole = false;
  const hasLegacyRecoveryRole = false;
  // data?.legacyNumberOfRecoveryRoles
  //   ? data?.legacyNumberOfRecoveryRoles > 1
  //   : false;
  return {
    userHasPermission,
    disabledInput: defaultDisabledInput, // !canUpgradeVersion ||
    disabledSubmit: defaultDisabledSubmit || hasLegacyRecoveryRole,
    canCreateMotion,
    canOnlyForceAction,
    hasLegacyRecoveryRole,
    isLoadingLegacyRecoveryRole,
  };
};
