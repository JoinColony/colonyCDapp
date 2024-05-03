import { Extension } from '@colony/colony-js';

import useExtensionData from '~hooks/useExtensionData.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

const useStreamingPayments = () => {
  const { extensionData, loading: extensionLoading } = useExtensionData(
    Extension.StreamingPayments,
  );

  const getStreamingPaymentsAddress = () => {
    if (!extensionData || !isInstalledExtensionData(extensionData)) {
      return undefined;
    }

    return extensionData.address;
  };

  return {
    isLoading: extensionLoading,
    streamingPaymentsAddress: getStreamingPaymentsAddress(),
  };
};

export default useStreamingPayments;
