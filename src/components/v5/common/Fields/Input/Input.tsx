import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import FormError from '~v5/shared/FormError';
import { InputProps } from './types';
import { useInput } from '../hooks';
import { DEFAULT_MAX_CHAR_NUMBER } from './consts';

const displayName = 'v5.common.Textarea';

// @TODO: add custom input status pills

const Input: FC<InputProps> = ({
  maxCharNumber = DEFAULT_MAX_CHAR_NUMBER,
  placeholder,
  shouldNumberOfCharsBeVisible = false,
  isError,
  customErrorMessage,
  defaultValue,
  name,
  register,
}) => {
  const { formatMessage } = useIntl();
  const { isTyping, isCharLenghtError, currentCharNumber, onChange } = useInput(
    maxCharNumber,
    defaultValue,
  );

  const isErrorStatus = isCharLenghtError || isError;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex relative">
        <input
          type="text"
          {...register?.(name)}
          name={name}
          placeholder={placeholder}
          className={clsx('input-round input', {
            'border-gray-300': !isTyping,
            'border-blue-200 shadow-lightBlue': isTyping,
            'border-negative-400': isErrorStatus,
          })}
          defaultValue={defaultValue}
          onChange={onChange}
        />
        {!!currentCharNumber && shouldNumberOfCharsBeVisible && (
          <div
            className={clsx('text-4 flex absolute right-3 top-4', {
              'text-negative-400': isErrorStatus,
              'text-gray-500': !isErrorStatus,
            })}
          >
            {currentCharNumber}/{maxCharNumber}
          </div>
        )}
      </div>
      {isErrorStatus && (
        <FormError isFullSize alignment="left">
          {formatMessage({ id: customErrorMessage || 'too.many.characters' })}
        </FormError>
      )}
    </div>
  );
};

Input.displayName = displayName;

export default Input;
