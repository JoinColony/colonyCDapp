export const isElementOverflowingContainerY = (element: HTMLElement | null) => {
  if (!element || !element.parentElement) {
    return false;
  }

  const elementBoundingRect = element.getBoundingClientRect();
  const containerBoundingRect = element.parentElement.getBoundingClientRect();

  return (
    elementBoundingRect.bottom > containerBoundingRect.bottom ||
    elementBoundingRect.top < containerBoundingRect.top
  );
};
