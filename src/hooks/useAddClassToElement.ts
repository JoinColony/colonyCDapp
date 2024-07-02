import { useEffect } from 'react';

export const useAddClassToElement = ({
  shouldAddClass,
  element,
  className,
}: {
  shouldAddClass: boolean;
  element: HTMLElement;
  className: string;
}): void => {
  useEffect(() => {
    if (shouldAddClass && !element.classList.contains(className)) {
      element.classList.add(className);
    }

    return () => {
      element.classList.remove(className);
    };
  }, [shouldAddClass, element, className]);
};
