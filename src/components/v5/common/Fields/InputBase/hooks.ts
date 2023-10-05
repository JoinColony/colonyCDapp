import noop from 'lodash/noop';
import { useLayoutEffect, useRef } from 'react';

export const useAdjustInputWidth = (autoWidth: boolean) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!inputRef.current || !autoWidth) {
      return noop;
    }

    const textMeasureContainer = document.createElement('span');

    document.body.appendChild(textMeasureContainer);

    const input = inputRef.current;
    const changeHandler = () => {
      Object.entries(
        document.defaultView?.getComputedStyle(input) || {},
      ).forEach(([key, value]) => {
        if (!key.startsWith('font') || !(key in textMeasureContainer.style)) {
          return;
        }

        textMeasureContainer.style[key] = value;
      });

      textMeasureContainer.innerHTML =
        (input.type === 'number' && !Number.isNaN(input.valueAsNumber)
          ? input.valueAsNumber.toString()
          : input.value) || '0';
      input.style.width = `${
        textMeasureContainer.getBoundingClientRect().width + 2
      }px`;
    };

    input.addEventListener('input', changeHandler);
    changeHandler();

    return () => {
      textMeasureContainer.remove();
      input.removeEventListener('input', changeHandler);
      input.style.width = '';
    };
  }, [autoWidth]);

  return inputRef;
};
