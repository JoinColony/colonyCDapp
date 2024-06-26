import { type Icon } from '@phosphor-icons/react';

import { NETWORK_DATA } from '~constants/index.ts';
import { type NavigationSidebarLinksListItem } from '~v5/frame/NavigationSidebar/partials/NavigationSidebarLinksList/types.ts';

export const getChainIcon = (chainId: string | undefined): Icon | undefined =>
  Object.values(NETWORK_DATA).find(({ chainId: id }) => id === chainId)?.icon;

export const checkIfIsActive = (
  pathname: string | undefined,
  items: NavigationSidebarLinksListItem[],
): boolean => {
  if (typeof pathname !== 'string') {
    return false;
  }

  return items.some(
    ({ to }) =>
      (typeof to === 'string' ? to.replace(/^\/|/g, '') : to) === pathname,
  );
};
