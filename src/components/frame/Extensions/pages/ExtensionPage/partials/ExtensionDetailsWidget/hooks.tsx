import { type Extension } from '@colony/colony-js';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux/index.ts';
import Toast from '~shared/Extensions/Toast/index.ts';

import { waitForDbAfterExtensionAction } from '../../utils.tsx';

export const useDeprecate = ({ extensionId }: { extensionId: Extension }) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { refetchExtensionData } = useExtensionData(extensionId);
  const deprecateExtensionValues = {
    colonyAddress,
    extensionId,
    isToDeprecate: true,
  };

  const deprecateAsyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_DEPRECATE,
    error: ActionTypes.EXTENSION_DEPRECATE_ERROR,
    success: ActionTypes.EXTENSION_DEPRECATE_SUCCESS,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleDeprecate = async () => {
    try {
      setIsLoading(true);
      await deprecateAsyncFunction(deprecateExtensionValues);
      await waitForDbAfterExtensionAction({
        method: ExtensionMethods.DEPRECATE,
        refetchExtensionData,
      });
      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionDeprecate.toast.title.success' }}
          description={{ id: 'extensionDeprecate.toast.description.success' }}
        />,
      );
    } catch (err) {
      console.error(err);
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionDeprecate.toast.title.error' }}
          description={{ id: 'extensionDeprecate.toast.description.error' }}
        />,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleDeprecate,
    isLoading,
  };
};

export const useUninstall = ({ extensionId }: { extensionId: Extension }) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const [isLoading, setIsLoading] = useState(false);
  const { refetchExtensionData } = useExtensionData(extensionId);
  const uninstallExtensionValues = {
    colonyAddress,
    extensionId,
  };

  const uninstallAsyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_UNINSTALL,
    error: ActionTypes.EXTENSION_UNINSTALL_ERROR,
    success: ActionTypes.EXTENSION_UNINSTALL_SUCCESS,
  });

  const handleUninstall = async () => {
    try {
      setIsLoading(true);
      await uninstallAsyncFunction(uninstallExtensionValues);
      await waitForDbAfterExtensionAction({
        method: ExtensionMethods.UNINSTALL,
        refetchExtensionData,
      });
      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionUninstall.toast.title.success' }}
          description={{
            id: 'extensionUninstall.toast.description.success',
          }}
        />,
      );
    } catch (err) {
      console.error(err);
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionUninstall.toast.title.error' }}
          description={{
            id: 'extensionUninstall.toast.description.error',
          }}
        />,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { handleUninstall, isLoading };
};

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
