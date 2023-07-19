import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import FormError from '~v5/shared/FormError';
import { InputProps } from './types';
import { useInput } from '../hooks';
import { DEFAULT_MAX_CHAR_NUMBER } from './consts';
import Icon from '~shared/Icon';

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
  className,
  decoratedError,
  successfulMessage,
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
          className={clsx(className, 'input-round input', {
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
      {successfulMessage && (
        <div
          className="border border-success-200 rounded-3xl py-1.5
        px-3 text-success-400 flex self-start items-center text-3"
        >
          <Icon name="check-circle" appearance={{ size: 'small' }} />
          <span className="ml-1">
            {formatMessage({
              id: successfulMessage,
            })}
          </span>
        </div>
      )}
      {isErrorStatus && (
        <>
          {decoratedError ? (
            <div
              className="border border-negative-200 rounded-3xl py-1.5
              px-3 text-negative-400 flex self-start items-center text-3"
            >
              <Icon name="x-circle" appearance={{ size: 'small' }} />
              <span className="ml-1">
                {formatMessage({
                  id: customErrorMessage || 'too.many.characters',
                })}
              </span>
            </div>
          ) : (
            <FormError isFullSize alignment="left">
              {formatMessage({
                id: customErrorMessage || 'too.many.characters',
              })}
            </FormError>
          )}
        </>
      )}
    </div>
  );
};

Input.displayName = displayName;

export default Input;
