import { isChildOf } from '~utils/checks/isChildOf.ts';
import { getElementWithSelector } from '~utils/elements.ts';
import { getPortalContainer } from '~v5/shared/Portal/utils.ts';

export const isElementInsideModalOrPortal = (element: Element) => {
  const reactModalPortals = Array.from(
    document.querySelectorAll('.ReactModalPortal'),
  );

  // Element inside the modal or in the portal container
  if (
    getPortalContainer().contains(element) ||
    reactModalPortals.some((portal) => portal.contains(element))
  ) {
    return true;
  }

  return false;
};

export const isElementInsideDynamicXYZModal = (element: Element) => {
  const dynamicWalletModal = getElementWithSelector('#dynamic-modal');
  const dynamicSendTransactionModal = getElementWithSelector(
    '#dynamic-send-transaction',
  );
  const dynamicSignMessageModal = getElementWithSelector(
    '#dynamic-sign-message',
  );

  return [
    dynamicWalletModal,
    dynamicSendTransactionModal,
    dynamicSignMessageModal,
  ].some((modal) => isChildOf(modal, element));
};
