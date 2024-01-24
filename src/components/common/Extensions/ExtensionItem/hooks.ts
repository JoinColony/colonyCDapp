import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useColonyContext } from '~context/ColonyContext';
import useExtensionData from '~hooks/useExtensionData';
import useExtensionsBadge from '~hooks/useExtensionsBadgeStatus';
import { COLONY_EXTENSIONS_ROUTE } from '~routes';
import { isInstalledExtensionData } from '~utils/extensions';

export const useExtensionItem = (extensionId: string) => {
  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId);
  const navigate = useNavigate();

  const isExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  const { status, badgeMessage } = useExtensionsBadge(extensionData);

  const extensionUrl = `/${colonyName}/${COLONY_EXTENSIONS_ROUTE}/${extensionId}`;

  const handleNavigateToExtensionDetails = useCallback(() => {
    navigate(extensionUrl);
  }, [navigate, extensionUrl]);

  return {
    extensionUrl,
    isExtensionInstalled,
    status,
    badgeMessage,
    handleNavigateToExtensionDetails,
  };
};
