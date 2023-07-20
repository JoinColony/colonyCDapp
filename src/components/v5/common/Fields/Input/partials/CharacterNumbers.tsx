import React, { FC } from 'react';
import clsx from 'clsx';
import { DEFAULT_MAX_CHAR_NUMBER } from '../consts';
import { CharacterNumbersProps } from '../types';

const displayName = 'v5.common.Fields.partials.CharacterNumbers';

const CharacterNumbers: FC<CharacterNumbersProps> = ({
  maxCharNumber = DEFAULT_MAX_CHAR_NUMBER,
  isError,
  isCharLenghtError,
  currentCharNumber,
}) => {
  const isErrorStatus = isCharLenghtError || isError;

  return (
    <div
      className={clsx('text-4 flex absolute right-3 top-4', {
        'text-negative-400': isErrorStatus,
        'text-gray-500': !isErrorStatus,
      })}
    >
      {currentCharNumber}/{maxCharNumber}
    </div>
  );
};

CharacterNumbers.displayName = displayName;

export default CharacterNumbers;
