import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';
import { useColonyContext, useExtensionData } from '~hooks';
import { isInstalledExtensionData } from '~utils/extensions';
import { useExtensionsBadge } from '~hooks/useExtensionsBadgeStatus';

export const useExtensionItem = (extensionId: string) => {
  const { colony } = useColonyContext();
  const { extensionData } = useExtensionData(extensionId);
  const navigate = useNavigate();

  const isExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  const { status, badgeMessage } = useExtensionsBadge(extensionData);

  const extensionUrl = `/colony/${colony?.name}/extensions/${extensionId}`;

  const handeNavigateToExtensionDetails = useCallback(() => {
    navigate(extensionUrl);
  }, [navigate, extensionUrl]);

  return {
    extensionUrl,
    isExtensionInstalled,
    status,
    badgeMessage,
    handeNavigateToExtensionDetails,
  };
};
