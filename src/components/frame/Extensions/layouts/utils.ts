import { NETWORK_DATA } from '~constants';
import { NavigationSidebarLinksListItem } from '~v5/frame/NavigationSidebar/partials/NavigationSidebarLinksList/types';

export const getChainIconName = (
  chainId: number | undefined,
): string | undefined =>
  Object.values(NETWORK_DATA).find(({ chainId: id }) => id === chainId)
    ?.iconName;

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
