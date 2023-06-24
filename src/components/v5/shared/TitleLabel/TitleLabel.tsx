import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { TitleLabelProps } from './types';

const displayName = 'v5.TitleLabel';

const TitleLabel: FC<TitleLabelProps> = ({ text, className }) => {
  const { formatMessage } = useIntl();

  const textLabel =
    typeof text === 'string' ? text : text && formatMessage(text);

  return (
    <span
      className={clsx(
        className,
        'block text-gray-400 text-4 uppercase group-hover:text-blue-400 transition-all duration-normal',
      )}
    >
      {textLabel}
    </span>
  );
};

TitleLabel.displayName = displayName;

export default TitleLabel;
