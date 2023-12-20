import React, { useLayoutEffect } from 'react';
import clsx from 'clsx';

import { useStateClassNames } from '~v5/common/Fields/hooks';
import { FIELD_STATE } from '~v5/common/Fields/consts';
import { notMaybe } from '~utils/arrays';

import { TextareaBaseProps } from './types';
import useAutosizeTextArea from './hooks';

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
      ...rest
    },
    ref,
  ) => {
    const stateClassNames = useStateClassNames(
      {
        [FIELD_STATE.Error]:
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
            'text-md placeholder:text-gray-400 resize-none w-full outline-none',
            {
              'text-gray-400 pointer-events-none': disabled,
            },
          )}
          value={value}
          {...rest}
        />
        {state === FIELD_STATE.Error && notMaybe(maxLength) && (
          <div
            className={clsx('text-4 flex justify-end absolute right-0', {
              'text-negative-400': state === FIELD_STATE.Error,
              'text-gray-500': state !== FIELD_STATE.Error,
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

Object.assign(TextareaBase, { displayName });

export default TextareaBase;
