export const addWidthProperty = (
  element: HTMLElement | null,
  wrapperElement: HTMLElement | null,
  propertyName: string,
) => {
  if (element && wrapperElement) {
    const { width } = element.getBoundingClientRect();

    wrapperElement.style.setProperty(`--${propertyName}-width`, `${width}px`);
  }
};
