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
  ...rest
}) => {
  const stateClassNames = useStateClassNames({
    [FIELD_STATE.Error]:
      'border-negative-400 text-negative-400 focus:border-negative-400',
  });

  const textAreaRef = useAutosizeTextArea(value);

  return (
    <textarea
      rows={1}
      ref={textAreaRef}
      className={clsx(
        className,
        state ? stateClassNames[state] : undefined,
        'text-md placeholder:text-gray-500 resize-none w-full outline-none',
        {
          'text-gray-400 pointer-events-none': disabled,
        },
      )}
      value={value}
      {...rest}
    />
  );
};

TextareaBase.displayName = displayName;

export default TextareaBase;
