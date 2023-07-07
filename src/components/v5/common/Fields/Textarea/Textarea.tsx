import React, { FC, useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import debounce from 'lodash.debounce';

import FormError from '~v5/shared/FormError';
import { TextareaProps } from './types';
import { DEFAULT_MAX_CHAR_NUMBER } from './consts';

const displayName = 'v5.common.Textarea';

const Textarea: FC<TextareaProps> = ({
  textareaTitle = '',
  maxCharNumber = DEFAULT_MAX_CHAR_NUMBER,
  placeholder,
  showFieldLimit = false,
  shouldNumberOfCharsBeVisible = false,
}) => {
  const { formatMessage } = useIntl();
  const [currentCharNumber, setCurrentCharNumber] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const isError = useMemo(
    () => currentCharNumber > maxCharNumber && showFieldLimit,
    [currentCharNumber, maxCharNumber, showFieldLimit],
  );

  const onChangeTyping = useCallback(() => setIsTyping(false), []);

  const debounced = useMemo(
    () => debounce(onChangeTyping, 1000),
    [onChangeTyping],
  );

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      setIsTyping(true);
      const { value } = e.target;
      setCurrentCharNumber(value.length);
      debounced(value);
    },
    [debounced],
  );

  const label =
    typeof textareaTitle === 'string'
      ? textareaTitle
      : formatMessage(textareaTitle);

  return (
    <div className="flex flex-col gap-1">
      {textareaTitle && (
        <label htmlFor="message" className="text-gray-700 text-1">
          {label}
        </label>
      )}
      <div
        className={clsx(
          'bg-base-white w-full min-h-[5.75rem] rounded border py-3 px-3.5',
          {
            'border-gray-300': !isTyping,
            'border-blue-200 shadow-lightBlue': isTyping,
            'border-red-400': isError,
          },
        )}
      >
        <textarea
          id="message"
          placeholder={placeholder}
          className="resize-none w-full text-gray-900 text-md outline-0 placeholder:text-gray-500"
          onChange={onChange}
        />
        {!!currentCharNumber && shouldNumberOfCharsBeVisible && (
          <div
            className={clsx('text-4 flex justify-end', {
              'text-red-400': isError,
            })}
          >
            {currentCharNumber}/{maxCharNumber}
          </div>
        )}
      </div>
      {showFieldLimit && (
        <span className="flex justify-end text-gray-600 text-xs">
          {formatMessage({ id: 'characters.remaining' }, { maxCharNumber })}
        </span>
      )}
      {isError && (
        <FormError isFullSize alignment="left">
          {formatMessage({ id: 'too.many.characters' })}
        </FormError>
      )}
    </div>
  );
};

Textarea.displayName = displayName;

export default Textarea;
