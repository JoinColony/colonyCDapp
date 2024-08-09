export const addClassToElement = (
  element: HTMLElement | null,
  className: string,
) => {
  if (!element) {
    return;
  }
  element.classList.add(className);
};
