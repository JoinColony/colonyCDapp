import { useColonyContext, useUserByNameOrAddress, useUserReputationForTopDomains } from '~hooks';
import { AnyExtensionData, InstalledExtensionData } from '~types';
import { findDomainByNativeId } from '~utils/domains';
import { SpecificSidePanelHookProps } from '../types';

export const useGetInstalledByData = (extensionData: AnyExtensionData): SpecificSidePanelHookProps | undefined => {
  const { colony } = useColonyContext();
  const { user } = useUserByNameOrAddress((extensionData as InstalledExtensionData)?.installedBy);
  const { walletAddress } = user || {};
  const { userReputation } = useUserReputationForTopDomains(colony?.colonyAddress, walletAddress);

  if (!colony) {
    return undefined;
  }

  const formattedUserReputations = userReputation?.map(({ domainId, ...rest }) => {
    const reputationDomain = findDomainByNativeId(domainId, colony);
    return {
      ...rest,
      reputationDomain,
    };
  });
  const colonyReputationItems = (formattedUserReputations || [])?.map(({ reputationDomain, reputationPercentage }) => {
    const name = reputationDomain?.metadata?.name;

    return {
      key: `${reputationDomain?.id}-${reputationPercentage}`,
      title: name || '',
      percentage: reputationPercentage,
    };
  });

  return { colonyReputationItems };
};
