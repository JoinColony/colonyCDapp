import clsx from 'clsx';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import FormError from '~v5/shared/FormError/index.ts';

import { useInput } from '../hooks.ts';

import { DEFAULT_MAX_CHAR_NUMBER } from './consts.ts';
import { type TextareaProps } from './types.ts';

const displayName = 'v5.common.Textarea';

const Textarea: FC<TextareaProps> = ({
  textareaTitle = '',
  maxCharNumber = DEFAULT_MAX_CHAR_NUMBER,
  placeholder,
  showFieldLimit = false,
  shouldNumberOfCharsBeVisible = false,
  name = '',
  register,
  isError,
}) => {
  const { formatMessage } = useIntl();
  const { isTyping, isCharLenghtError, currentCharNumber, onChange } =
    useInput(maxCharNumber);

  const label =
    typeof textareaTitle === 'string'
      ? textareaTitle
      : formatMessage(textareaTitle);

  const isErrorStatus = isCharLenghtError || isError;

  return (
    <div className="flex flex-col">
      {textareaTitle && (
        <label htmlFor="message" className="text-gray-700 text-1">
          {label}
        </label>
      )}
      <div
        className={clsx(
          'relative min-h-[5.75rem] w-full rounded border bg-base-white',
          {
            'border-gray-300': !isTyping,
            'border-blue-200': isTyping,
            'border-negative-400': isErrorStatus,
          },
        )}
      >
        <textarea
          id="message"
          {...register?.(name)}
          name={name}
          placeholder={placeholder}
          className="input absolute inset-0 resize-none rounded bg-base-white px-3.5 py-3"
          onChange={onChange}
        />
        {!!currentCharNumber && shouldNumberOfCharsBeVisible && (
          <div
            className={clsx(
              'absolute bottom-3 right-3.5 flex justify-end text-4',
              {
                'text-negative-400': isErrorStatus,
                'text-gray-500': !isErrorStatus,
              },
            )}
          >
            {currentCharNumber}/{maxCharNumber}
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-between">
        {isErrorStatus && (
          <span>
            <FormError isFullSize alignment="left">
              {formatMessage({ id: 'too.many.characters' })}
            </FormError>
          </span>
        )}
        {showFieldLimit && (
          <div className="ml-auto flex justify-end text-xs text-gray-600">
            {formatMessage({ id: 'characters.remaining' }, { maxCharNumber })}
          </div>
        )}
      </div>
    </div>
  );
};

Textarea.displayName = displayName;

export default Textarea;
