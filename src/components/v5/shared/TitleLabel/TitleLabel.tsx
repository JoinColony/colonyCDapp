import clsx from 'clsx';
import React, { type FC } from 'react';

import { formatText } from '~utils/intl.ts';

import { type TitleLabelProps } from './types.ts';

const displayName = 'v5.TitleLabel';

const TitleLabel: FC<TitleLabelProps> = ({
  text,
  className,
  textSizeClassName = 'text-4',
}) => {
  if (!text) {
    return null;
  }

  const textLabel = formatText(text);

  return (
    <span
      className={clsx(
        className,
        textSizeClassName,
        'block text-gray-400 uppercase group-hover:text-blue-400 transition-all duration-normal',
      )}
    >
      {textLabel}
    </span>
  );
};

TitleLabel.displayName = displayName;

export default TitleLabel;
