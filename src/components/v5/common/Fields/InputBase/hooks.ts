import { ReactInstanceWithCleave } from 'cleave.js/react/props';
import noop from 'lodash/noop';
import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { FormattedInputProps } from './types';
import { addWidthProperty } from './utils';

export const useAdjustInputWidth = (
  autoWidth: boolean,
  externalInputRef: React.ForwardedRef<HTMLInputElement>,
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(externalInputRef, () => {
    if (!inputRef.current) {
      throw new Error('Input ref is not available');
    }

    return inputRef.current;
  });

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

export const useFormattedInput = (
  value: FormattedInputProps['value'],
  options?: FormattedInputProps['options'],
) => {
  const [cleave, setCleave] = useState<ReactInstanceWithCleave | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const customPrefixRef = useRef<HTMLDivElement | null>(null);

  const { prefix, tailPrefix } = options || {};

  /**
   * Sync the cleave raw value with value prop
   * This is necessary for correctly setting the initial value
   */
  useEffect(() => {
    if (typeof value !== 'string') {
      return;
    }

    cleave?.setRawValue(
      `${prefix && !tailPrefix ? prefix : ''}${value}${
        prefix && tailPrefix ? ` ${prefix}` : ''
      }`,
    );
  }, [cleave, prefix, tailPrefix, value]);

  useEffect(() => {
    addWidthProperty(buttonRef.current, wrapperRef.current, 'button');
    addWidthProperty(
      customPrefixRef.current,
      wrapperRef.current,
      'custom-prefix',
    );
  }, []);

  // /*
  //  * @NOTE Coerce cleave into handling dynamically changing options
  //  * See here for why this isn't yet supported "officially":
  //  * https://github.com/nosir/cleave.js/issues/352#issuecomment-447640572
  //  */

  const dynamicCleaveOptionKey = JSON.stringify(options);

  return {
    dynamicCleaveOptionKey,
    setCleave,
    wrapperRef,
    buttonRef,
    customPrefixRef,
  };
};
