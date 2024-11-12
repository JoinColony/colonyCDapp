import clsx from 'clsx';
import React, { type FC, useEffect, useLayoutEffect } from 'react';
import { useIntl } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { formatText } from '~utils/intl.ts';
import FormError from '~v5/shared/FormError/index.ts';

import { useInput } from '../hooks.ts';

import { DEFAULT_MAX_CHAR_NUMBER } from './consts.ts';
import CharacterNumbers from './partials/CharacterNumbers.tsx';
import InputPills from './partials/InputPills.tsx';
import { type InputProps } from './types.ts';

const displayName = 'v5.common.Fields.Input';

const Input: FC<InputProps> = ({
  maxCharNumber = DEFAULT_MAX_CHAR_NUMBER,
  errorMaxChar = false,
  placeholder,
  shouldNumberOfCharsBeVisible = false,
  shouldErrorMessageBeVisible = true,
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
  setIsTyping,
  shouldFocus,
  allowLayoutShift = false,
  registerOptions,
}) => {
  const { formatMessage } = useIntl();
  const { isTyping, isCharLenghtError, currentCharNumber, onChange } = useInput(
    maxCharNumber,
    defaultValue,
  );
  const registerField = register && register(name, registerOptions);

  const isErrorStatus = isCharLenghtError || isError;

  useEffect(() => {
    if (setIsTyping) {
      setIsTyping(isTyping);
    }
  }, [isTyping, setIsTyping]);

  useLayoutEffect(() => {
    if (shouldFocus) {
      const inputElement = document.querySelector(
        `#id-${name}`,
      ) as HTMLElement | null;
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [shouldFocus, name]);

  const input = (
    <div className="relative w-full">
      <input
        {...registerField}
        type="text"
        name={name}
        placeholder={placeholder}
        className={clsx(className, 'input-round input focus:border-blue-200', {
          'border-gray-300': !isTyping,
          'border-blue-200': isTyping,
          'border-negative-400 focus:border-negative-400 focus:shadow-none':
            isErrorStatus,
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
    <div className="relative">
      {labelMessage && (
        <label
          className={clsx(labelClassName, 'flex flex-col text-1', {
            'pb-1.5': !subLabelMessage,
            'pb-2': subLabelMessage,
          })}
          htmlFor={`id-${name}`}
        >
          {formatText(labelMessage)}
          {subLabelMessage && (
            <span className="text-sm font-normal text-gray-600">
              {formatText(subLabelMessage)}
            </span>
          )}
        </label>
      )}

      {isDisabled && disabledTooltipMessage ? (
        <Tooltip
          isFullWidthContent
          tooltipContent={
            <span className="w-full text-3">
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
      <div className="relative">
        {!isTyping && !isErrorStatus && successfulMessage && (
          <InputPills message={successfulMessage} status="success" />
        )}

        {shouldErrorMessageBeVisible && isErrorStatus && !isTyping && (
          <>
            {isDecoratedError ? (
              <InputPills message={customErrorMessage} status="error" />
            ) : (
              <FormError
                isFullSize
                alignment="left"
                allowLayoutShift={allowLayoutShift}
              >
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
