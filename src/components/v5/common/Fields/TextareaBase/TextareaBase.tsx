import clsx from 'clsx';
import React, { useLayoutEffect } from 'react';

import { notMaybe } from '~utils/arrays/index.ts';
import { FieldState } from '~v5/common/Fields/consts.ts';
import { useStateClassNames } from '~v5/common/Fields/hooks.ts';

import useAutosizeTextArea from './hooks.ts';
import { type TextareaBaseProps } from './types.ts';

const displayName = 'v5.common.Fields.TextareaBase';

const TextareaBase = React.forwardRef<HTMLTextAreaElement, TextareaBaseProps>(
  (
    {
      className,
      state,
      disabled,
      value,
      stateClassNames: stateClassNamesProp,
      wrapperClassName,
      message,
      maxLength,
      shouldFocus,
      withoutCounter,
      ...rest
    },
    ref,
  ) => {
    const stateClassNames = useStateClassNames(
      {
        [FieldState.Error]:
          'border-negative-400 text-negative-400 focus:border-negative-400 placeholder:!text-negative-400',
      },
      stateClassNamesProp,
    );

    const textAreaRef = useAutosizeTextArea(value, ref);

    useLayoutEffect(() => {
      if (textAreaRef.current && shouldFocus) {
        textAreaRef.current.focus();
      }
    }, [shouldFocus, textAreaRef]);

    return (
      <div className={clsx(wrapperClassName, 'w-full')}>
        <textarea
          rows={1}
          ref={textAreaRef}
          className={clsx(
            className,
            state ? stateClassNames[state] : undefined,
            'w-full resize-none bg-base-white text-md outline-none',
            {
              'placeholder:text-gray-400': !disabled,
              'pointer-events-none text-gray-300 placeholder:text-gray-300':
                disabled,
            },
          )}
          value={value}
          {...rest}
        />
        {state === FieldState.Error &&
          notMaybe(maxLength) &&
          !withoutCounter && (
            <div
              className={clsx('absolute right-0 flex justify-end text-4', {
                'text-negative-400': state === FieldState.Error,
                'text-gray-500': state !== FieldState.Error,
              })}
            >
              {typeof value === 'string' && value.length}/{maxLength}
            </div>
          )}
        {message}
      </div>
    );
  },
);

TextareaBase.displayName = displayName;

export default TextareaBase;
