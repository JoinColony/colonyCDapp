import { useCallback, useMemo } from 'react';
import { useAsyncFunction, useColonyContext } from '~hooks';
import { AnyExtensionData } from '~types';
import { ActionTypes } from '~redux';

export const useExtensionDetails = (extensionData: AnyExtensionData) => {
  const submit = ActionTypes.EXTENSION_DEPRECATE;
  const error = ActionTypes.EXTENSION_DEPRECATE_ERROR;
  const success = ActionTypes.EXTENSION_DEPRECATE_SUCCESS;
  const { colony } = useColonyContext();
  const { extensionId } = extensionData;

  const extensionValues = useMemo(() => {
    return {
      colonyAddress: colony?.colonyAddress,
      extensionId,
      isToDeprecate: true,
    };
  }, [colony?.colonyAddress, extensionId]);

  const asyncFunction = useAsyncFunction({ submit, error, success });

  const handleDeprecate = useCallback(async () => {
    try {
      await asyncFunction(extensionValues);
    } catch (err) {
      console.error(err);
    }
  }, [asyncFunction, extensionValues]);

  return { handleDeprecate };
};
