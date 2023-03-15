import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types';

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
