import clsx from 'clsx';
import React, { FC } from 'react';

import { DEFAULT_MAX_CHAR_NUMBER } from '../consts';
import { CharacterNumbersProps } from '../types';

const displayName = 'v5.common.Fields.partials.CharacterNumbers';

const CharacterNumbers: FC<CharacterNumbersProps> = ({
  maxCharNumber = DEFAULT_MAX_CHAR_NUMBER,
  isError,
  currentCharNumber,
  isShowingLabel,
}) => (
  <div
    className={clsx('text-4 flex absolute right-3', {
      'text-negative-400': isError,
      'text-gray-500': !isError,
      'top-10': isShowingLabel,
      'top-4': !isShowingLabel,
    })}
  >
    {currentCharNumber}/{maxCharNumber}
  </div>
);

CharacterNumbers.displayName = displayName;

export default CharacterNumbers;
