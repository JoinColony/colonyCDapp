import { useCallback } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';

import {
  waitForColonyPermissions,
  waitForDbAfterExtensionAction,
} from './utils.tsx';

export const useCheckExtensionEnabled = (extensionId) => {
  const { refetchColony } = useColonyContext();
  const { extensionData, refetchExtensionData } = useExtensionData(
    extensionId ?? '',
  );

  const checkExtensionEnabled = useCallback(async () => {
    /* Wait for permissions first, so that the permissions warning doesn't flash in the ui */
    await waitForColonyPermissions({ extensionData, refetchColony });
    await waitForDbAfterExtensionAction({
      method: ExtensionMethods.ENABLE,
      refetchExtensionData,
    });
  }, [extensionData, refetchColony, refetchExtensionData]);

  return { checkExtensionEnabled };
};
