import { Extension } from '@colony/colony-js';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useSearchActionsQuery } from '~gql';
import useExtensionData from '~hooks/useExtensionData.ts';
import { COLONY_STREAMING_PAYMENTS_ROUTE } from '~routes';
import { isInstalledExtensionData } from '~utils/extensions.ts';

import { sidebarNavigationScheme } from '../consts.ts';

export const useSidebarRoutesScheme = () => {
  const { colony } = useColonyContext();

  const { colonyAddress } = colony;

  const { data } = useSearchActionsQuery({
    variables: {
      filter: {
        colonyId: { eq: colonyAddress },
        type: { eq: 'CREATE_STREAMING_PAYMENT' },
      },
      limit: 5,
    },
  });

  const excludeSubitemsPaths = (subitemsPathsToExclude: string[]) =>
    sidebarNavigationScheme.map((item) => {
      return {
        ...item,
        subItems: item.subItems?.filter(
          (subItem) => !subitemsPathsToExclude.includes(subItem.path),
        ),
      };
    });

  const hasStreamings = !!data?.searchColonyActions?.items.length;

  const { extensionData } = useExtensionData(Extension.StreamingPayments);
  const isStreamingPaymentsInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  const isStreamingsRouteVisible =
    isStreamingPaymentsInstalled || hasStreamings;

  const sidebarScheme = excludeSubitemsPaths(
    isStreamingsRouteVisible ? [] : [COLONY_STREAMING_PAYMENTS_ROUTE],
  );

  return {
    sidebarScheme,
  };
};
