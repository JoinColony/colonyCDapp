import clsx from 'clsx';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { WidgetBoxProps } from './types';

const displayName = 'v5.common.WidgetBox';

const WidgetBox: FC<WidgetBoxProps> = ({
  title,
  value,
  additionalContent,
  href,
  className = 'text-base-white bg-gray-900 border-gray-900',
}) => (
  <Link
    className={clsx(
      className,
      'rounded-lg p-6 w-full flex items-center justify-between gap-2 transition-all border sm:hover:text-gray-900 sm:hover:bg-base-white sm:hover:border-gray-900 sm:hover:cursor-pointer',
    )}
    to={href}
  >
    <div>
      <h3 className="text-1">{title}</h3>
      {value}
    </div>
    {additionalContent}
  </Link>
);

WidgetBox.displayName = displayName;

export default WidgetBox;
