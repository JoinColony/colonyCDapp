import noop from 'lodash/noop';
import { useEffect, useLayoutEffect, useRef, useImperativeHandle } from 'react';

import { getInputTextWidth } from '~utils/elements.ts';

import { addWidthProperty } from './utils.ts';

export const useAdjustInputWidth = (
  autoWidth: boolean,
  externalInputRef: React.ForwardedRef<HTMLInputElement>,
  usePlaceholderAsFallback?: boolean,
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

    const input = inputRef.current;
    const changeHandler = () => {
      input.style.width = `${getInputTextWidth(input, { usePlaceholderAsFallback: usePlaceholderAsFallback || true })}px`;
    };

    input.addEventListener('input', changeHandler);
    changeHandler();

    return () => {
      input.removeEventListener('input', changeHandler);
      input.style.width = '';
    };
  }, [autoWidth, usePlaceholderAsFallback]);

  return inputRef;
};

export const useFormattedInput = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const customPrefixRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    addWidthProperty(buttonRef.current, wrapperRef.current, 'button');
    addWidthProperty(
      customPrefixRef.current,
      wrapperRef.current,
      'custom-prefix',
    );
  }, []);

  return {
    wrapperRef,
    buttonRef,
    customPrefixRef,
  };
};
