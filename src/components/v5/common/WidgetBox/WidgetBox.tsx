import clsx from 'clsx';
import React, { type FC } from 'react';
import { Link } from 'react-router-dom';

import { type WidgetBoxProps } from './types.ts';

const displayName = 'v5.common.WidgetBox';

const WidgetBox: FC<WidgetBoxProps> = ({
  title,
  value,
  additionalContent,
  href,
  searchParams,
  className = 'bg-base-white border-gray-200 text-gray-900',
  icon: Icon,
  iconClassName = 'text-blue-400',
  contentClassName = 'block w-full',
  titleClassName = 'text-1',
}) => {
  const wrapperClassName =
    'rounded-lg py-6 px-6 w-full flex items-center justify-between gap-2 border';
  const baseContent = (
    <>
      <span className={contentClassName}>
        {title && <h3 className={clsx(titleClassName)}>{title}</h3>}
        {value}
      </span>
      {additionalContent}
    </>
  );

  const content = (
    <>
      {Icon ? (
        <span className="flex w-full items-center justify-between gap-4 sm:items-start sm:justify-start">
          <Icon className={iconClassName} size={24} />
          {baseContent}
        </span>
      ) : (
        baseContent
      )}
    </>
  );

  const hoverStyles =
    'transition-all sm:hover:border-gray-900 sm:hover:text-gray-900 sm:hover:bg-base-white';

  return href ? (
    <Link
      className={clsx(className, wrapperClassName, hoverStyles)}
      to={{ pathname: href, search: searchParams || '' }}
    >
      {content}
    </Link>
  ) : (
    <div className={clsx(className, wrapperClassName)}>{content}</div>
  );
};

WidgetBox.displayName = displayName;

export default WidgetBox;
