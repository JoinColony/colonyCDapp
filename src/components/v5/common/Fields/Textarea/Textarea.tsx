import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import FormError from '~v5/shared/FormError';
import { TextareaProps } from './types';
import { DEFAULT_MAX_CHAR_NUMBER } from './consts';
import { useInput } from '../hooks';

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
    <div className="flex flex-col gap-1">
      {textareaTitle && (
        <label htmlFor="message" className="text-gray-700 text-1">
          {label}
        </label>
      )}
      <div
        className={clsx('w-full min-h-[5.75rem] input-round', {
          'border-gray-300': !isTyping,
          'border-blue-200 shadow-lightBlue': isTyping,
          'border-negative-400': isErrorStatus,
        })}
      >
        <textarea
          id="message"
          {...register?.(name)}
          name={name}
          placeholder={placeholder}
          className="resize-none input"
          onChange={onChange}
        />
        {!!currentCharNumber && shouldNumberOfCharsBeVisible && (
          <div
            className={clsx('text-4 flex justify-end', {
              'text-negative-400': isErrorStatus,
              'text-gray-500': !isErrorStatus,
            })}
          >
            {currentCharNumber}/{maxCharNumber}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between w-full">
        {isErrorStatus && (
          <span>
            <FormError isFullSize alignment="left">
              {formatMessage({ id: 'too.many.characters' })}
            </FormError>
          </span>
        )}
        {showFieldLimit && (
          <div className="flex justify-end text-gray-600 text-xs ml-auto">
            {formatMessage({ id: 'characters.remaining' }, { maxCharNumber })}
          </div>
        )}
      </div>
    </div>
  );
};

Textarea.displayName = displayName;

export default Textarea;
