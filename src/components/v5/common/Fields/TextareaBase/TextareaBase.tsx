import React, { FC } from 'react';
import clsx from 'clsx';

import { TextareaBaseProps } from './types';
import { useStateClassNames } from '~v5/common/Fields/hooks';
import { FIELD_STATE } from '~v5/common/Fields/consts';
import useAutosizeTextArea from './hooks';

const displayName = 'v5.common.Fields.TextareaBase';

const TextareaBase: FC<TextareaBaseProps> = ({
  className,
  state,
  disabled,
  value,
  stateClassNames: stateClassNamesProp,
  maxCharNumber,
  ...rest
}) => {
  const stateClassNames = useStateClassNames(
    {
      [FIELD_STATE.Error]:
        'border-negative-400 text-negative-400 focus:border-negative-400',
    },
    stateClassNamesProp,
  );

  const textAreaRef = useAutosizeTextArea(value);

  return (
    <div className="flex flex-col w-full gap-1">
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
      {state === FIELD_STATE.Error && maxCharNumber && (
        <div
          className={clsx('text-4 flex justify-end', {
            'text-negative-400': state === FIELD_STATE.Error,
            'text-gray-500': state !== FIELD_STATE.Error,
          })}
        >
          {typeof value === 'string' && value.length}/{maxCharNumber}
        </div>
      )}
    </div>
  );
};

TextareaBase.displayName = displayName;

export default TextareaBase;
