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
import { formatText } from '~utils/intl';

const displayName = 'v5.common.Fields.Input';

const Input: FC<InputProps> = ({
  maxCharNumber = DEFAULT_MAX_CHAR_NUMBER,
  errorMaxChar = false,
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
  disabledTooltipMessage,
  labelMessage,
  labelClassName,
  subLabelMessage,
}) => {
  const { formatMessage } = useIntl();
  const { isTyping, isCharLenghtError, currentCharNumber, onChange } = useInput(
    maxCharNumber,
    defaultValue,
  );
  const registerField = register && register(name);

  const isErrorStatus = isCharLenghtError || isError;

  const input = (
    <div className="w-full relative">
      <input
        {...registerField}
        type="text"
        name={name}
        placeholder={placeholder}
        className={clsx(className, 'input-round input', {
          'border-gray-300': !isTyping,
          'border-blue-200 shadow-light-blue': isTyping,
          'border-negative-400': isErrorStatus,
          'text-gray-400': isDisabled,
        })}
        defaultValue={defaultValue}
        onChange={(e) => {
          onChange(e);
          registerField?.onChange(e);
        }}
        disabled={isDisabled}
        id={`id-${name}`}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      {labelMessage && (
        <label
          className={clsx(labelClassName, 'flex flex-col text-1')}
          htmlFor={`id-${name}`}
        >
          {formatText(labelMessage)}
          {subLabelMessage && (
            <span className="text-xs text-gray-400">
              {formatText(subLabelMessage)}
            </span>
          )}
        </label>
      )}

      {isDisabled && disabledTooltipMessage ? (
        <Tooltip
          isFullWidthContent
          tooltipContent={
            <span className="text-3 w-full">
              {formatText(disabledTooltipMessage)}
            </span>
          }
        >
          {input}
        </Tooltip>
      ) : (
        input
      )}

      {shouldNumberOfCharsBeVisible && (
        <CharacterNumbers
          isError={isErrorStatus}
          currentCharNumber={currentCharNumber}
          maxCharNumber={maxCharNumber}
          isShowingLabel={!!labelMessage}
        />
      )}

      {/* This is to stop layout shift when error messages are shown */}
      <div className="relative pb-9">
        {!isTyping && !isErrorStatus && successfulMessage && (
          <InputPills message={successfulMessage} status="success" />
        )}

        {isErrorStatus && !isTyping && (
          <>
            {isDecoratedError ? (
              <InputPills message={customErrorMessage} status="error" />
            ) : (
              <FormError isFullSize alignment="left">
                {customErrorMessage ||
                  (errorMaxChar
                    ? formatMessage(
                        { id: 'error.max.characters' },
                        { maxCharNumber },
                      )
                    : formatMessage({ id: 'too.many.characters' }))}
              </FormError>
            )}
          </>
        )}
      </div>
    </div>
  );
};

Input.displayName = displayName;

export default Input;
