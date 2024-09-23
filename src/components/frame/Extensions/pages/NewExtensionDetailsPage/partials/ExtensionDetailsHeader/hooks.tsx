import { type Extension } from '@colony/colony-js';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { waitForDbAfterExtensionAction } from '~frame/Extensions/pages/NewExtensionDetailsPage/utils.tsx';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux';
import Toast from '~shared/Extensions/Toast/index.ts';

export const useReenable = ({ extensionId }: { extensionId: Extension }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { refetchExtensionData } = useExtensionData(extensionId);

  const enableExtensionValues = {
    colonyAddress,
    extensionId,
    isToDeprecate: false,
  };

  const enableAsyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_DEPRECATE,
    error: ActionTypes.EXTENSION_DEPRECATE_ERROR,
    success: ActionTypes.EXTENSION_DEPRECATE_SUCCESS,
  });

  const handleReenable = async () => {
    try {
      setIsLoading(true);
      await enableAsyncFunction(enableExtensionValues);
      await waitForDbAfterExtensionAction({
        method: ExtensionMethods.REENABLE,
        refetchExtensionData,
      });
      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionReEnable.toast.title.success' }}
          description={{ id: 'extensionReEnable.toast.description.success' }}
        />,
      );
    } catch (err) {
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionReEnable.toast.title.error' }}
          description={{
            id: 'extensionReEnable.toast.description.error',
          }}
        />,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleReenable, isLoading };
};
