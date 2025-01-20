import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useExtensionData from '~hooks/useExtensionData.ts';
import useExtensionsBadge from '~hooks/useExtensionsBadgeStatus.ts';
import { COLONY_EXTENSIONS_ROUTE } from '~routes/index.ts';
import { isInstalledExtensionData } from '~utils/extensions.ts';

export const useExtensionItem = (extensionId: string) => {
  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const { extensionData, loading: extensionDataLoading } =
    useExtensionData(extensionId);
  const navigate = useNavigate();

  const isExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  const { status } = useExtensionsBadge(extensionData);

  const extensionUrl = `/${colonyName}/${COLONY_EXTENSIONS_ROUTE}/${extensionId}`;

  const handleNavigateToExtensionDetails = useCallback(() => {
    navigate(extensionUrl);
  }, [navigate, extensionUrl]);

  return {
    extensionUrl,
    isExtensionInstalled,
    isExtensionDataLoading: loading,
    status,
    handleNavigateToExtensionDetails,
    extensionDataLoading,
  };
};
