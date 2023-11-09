import { ColonyRole, Id } from '@colony/colony-js';

import {
  EnabledExtensionData,
  useActionDialogStatus,
  useColonyContractVersion,
} from '~hooks';
import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types';
import { canColonyBeUpgraded } from '~utils/checks';

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
    customActionTitle: '',
  };
};

export const useNetworkContractUpgradeDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  enabledExtensionData: EnabledExtensionData,
) => {
  const { colonyContractVersion } = useColonyContractVersion();

  const {
    disabledSubmit: defaultDisabledSubmit,
    disabledInput: defaultDisabledInput,
    ...rest
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

  const canUpgradeVersion = canColonyBeUpgraded(colony, colonyContractVersion);

  // const {
  //   data,
  //   loading: loadingLegacyRecoveyRole,
  // } = useLegacyNumberOfRecoveryRolesQuery({
  //   variables: {
  //     colonyAddress,
  //   },
  // });

  const isLoadingLegacyRecoveryRole = false; // @TODO: Add logic when this data becomes available.
  const hasLegacyRecoveryRole = false;
  // data?.legacyNumberOfRecoveryRoles
  //   ? data?.legacyNumberOfRecoveryRoles > 1
  //   : false;
  return {
    ...rest,
    disabledInput: defaultDisabledInput || !canUpgradeVersion,
    disabledSubmit:
      defaultDisabledSubmit || hasLegacyRecoveryRole || !canUpgradeVersion,
    hasLegacyRecoveryRole,
    isLoadingLegacyRecoveryRole,
  };
};
