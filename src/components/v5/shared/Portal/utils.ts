let portalContainer: HTMLElement | null = null;

export const getPortalContainer = () => {
  if (portalContainer) {
    return portalContainer;
  }

  portalContainer = document.createElement('div');
  document.body.appendChild(portalContainer);

  return portalContainer;
};
