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
        'block uppercase text-gray-400 transition-all duration-normal group-hover:text-blue-400',
      )}
    >
      {textLabel}
    </span>
  );
};

TitleLabel.displayName = displayName;

export default TitleLabel;
