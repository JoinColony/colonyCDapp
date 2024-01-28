import clsx from 'clsx';
import React, { type FC } from 'react';
import { Link } from 'react-router-dom';

import Icon from '~shared/Icon/index.ts';

import { type WidgetBoxProps } from './types.ts';

const displayName = 'v5.common.WidgetBox';

const WidgetBox: FC<WidgetBoxProps> = ({
  title,
  value,
  additionalContent,
  href,
  searchParams,
  className = 'bg-base-white border-gray-200 text-gray-900',
  iconName,
  iconClassName = 'text-blue-400',
  contentClassName = 'block w-full',
  titleClassName,
}) => {
  const wrapperClassName =
    'rounded-lg py-6 px-6 w-full flex items-center justify-between gap-2 border';
  const baseContent = (
    <>
      <span className={contentClassName}>
        {title && <h3 className={clsx(titleClassName, 'text-1')}>{title}</h3>}
        {value}
      </span>
      {additionalContent}
    </>
  );

  const content = (
    <>
      {iconName ? (
        <span className="w-full flex gap-4 items-center justify-between sm:items-start sm:justify-start">
          <Icon
            name={iconName}
            className={clsx(
              iconClassName,
              '!h-[1.5rem] !w-[1.5rem] flex-shrink-0',
            )}
          />
          {baseContent}
        </span>
      ) : (
        baseContent
      )}
    </>
  );

  const hoverStyles = 'transition-all sm:hover:border-gray-900';

  return href ? (
    <Link
      className={clsx(
        className,
        wrapperClassName,
        hoverStyles,
        'sm:hover:text-gray-900 sm:hover:bg-base-white',
      )}
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
