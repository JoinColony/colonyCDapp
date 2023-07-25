import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import FormError from '~v5/shared/FormError';
import { InputProps } from './types';
import { useInput } from '../hooks';
import { DEFAULT_MAX_CHAR_NUMBER } from './consts';
import Tooltip from '~shared/Extensions/Tooltip';
import InputPills from './partials/InputPills';
import CharacterNumbers from './partials/CharacterNumbers';

const displayName = 'v5.common.Fields.Input';

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
  isDecoratedError,
  successfulMessage,
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
        className={clsx(className, 'input-round input', {
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
    <div className="flex relative flex-col gap-1">
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

      {shouldNumberOfCharsBeVisible && isTyping && (
        <CharacterNumbers
          isError={isErrorStatus}
          currentCharNumber={currentCharNumber}
          maxCharNumber={maxCharNumber}
        />
      )}

      {!isTyping && !isError && successfulMessage && (
        <InputPills message={successfulMessage} status="success" />
      )}

      {isErrorStatus && (
        <>
          {isDecoratedError && !isTyping ? (
            <InputPills message={customErrorMessage} status="error" />
          ) : (
            <FormError isFullSize alignment="left">
              {customErrorMessage ||
                formatMessage({ id: 'too.many.characters' })}
            </FormError>
          )}
        </>
      )}
    </div>
  );
};

Input.displayName = displayName;

export default Input;
