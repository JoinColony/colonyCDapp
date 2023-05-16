import { ColonyRole, Id } from '@colony/colony-js';

import { EnabledExtensionData, useActionDialogStatus } from '~hooks';
import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types';

export const getUnlockTokenDialogPayload = (
  colony: Colony,
  { annotationMessage },
) => ({
  annotationMessage,
  colonyAddress: colony?.colonyAddress,
  operationName: RootMotionMethodNames.UnlockToken,
  motionParams: [],
  colonyName: colony?.name,
});

export const useUnlockTokenDialogStatus = (
  colony: Colony,
  requiredRoles: ColonyRole[],
  enabledExtensionData: EnabledExtensionData,
) => {
  const {
    userHasPermission,
    disabledInput,
    disabledSubmit: defaultDisabledSubmit,
    canCreateMotion,
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );
  const isNativeTokenUnlocked = !!colony?.status?.nativeToken?.unlocked;
  return {
    userHasPermission,
    disabledInput,
    disabledSubmit: defaultDisabledSubmit || isNativeTokenUnlocked,
    canCreateMotion,
    isNativeTokenUnlocked,
  };
};
