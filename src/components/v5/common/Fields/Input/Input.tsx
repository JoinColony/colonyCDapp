import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import FormError from '~v5/shared/FormError';
import { InputProps } from './types';
import { useInput } from '../hooks';
import { DEFAULT_MAX_CHAR_NUMBER } from './consts';
import Tooltip from '~shared/Extensions/Tooltip';

const displayName = 'v5.common.Fields.Input';

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
  isDisabled,
}) => {
  const { formatMessage } = useIntl();
  const { isTyping, isCharLenghtError, currentCharNumber, onChange } = useInput(
    maxCharNumber,
    defaultValue,
  );

  const isErrorStatus = isCharLenghtError || isError;

  const input = (
    <div className="w-full">
      <input
        type="text"
        {...register?.(name)}
        name={name}
        placeholder={placeholder}
        className={clsx('input-round input', {
          'border-gray-300': !isTyping,
          'border-blue-200 shadow-lightBlue': isTyping,
          'border-negative-400': isErrorStatus,
          'text-gray-400': isDisabled,
        })}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={isDisabled}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex relative">
        {isDisabled ? (
          <Tooltip
            isFullWidthContent
            tooltipContent={
              <span className="text-3 w-full">
                {formatMessage({
                  id: 'displayName.input.disabled',
                })}
              </span>
            }
          >
            {input}
          </Tooltip>
        ) : (
          input
        )}

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
