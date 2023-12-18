import { getPortalContainer } from '~v5/shared/Portal/utils';

export const isElementInsideModalOrPortal = (element: Element) => {
  const reactModalPortals = Array.from(
    document.querySelectorAll('.ReactModalPortal'),
  );

  // Element inside the modal or in the portal container
  if (
    getPortalContainer().contains(element) ||
    reactModalPortals.some((portal) => portal.contains(element))
  ) {
    return false;
  }

  return true;
};
