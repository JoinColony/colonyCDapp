import { CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useTablet } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Button, { CloseButton } from '~v5/shared/Button/index.ts';
import Link from '~v5/shared/Link/index.ts';

import { type CalamityBannerContentProps } from './types.ts';

const CalamityBannerContent: FC<CalamityBannerContentProps> = ({
  title,
  mode,
  linkProps,
  buttonProps,
  onCaretClick,
  onCloseClick,
  className,
}) => {
  const isTablet = useTablet();

  const closeButtonComponent = (
    <CloseButton
      className="text-gray-900 hover:text-blue-400 sm:-mr-4"
      onClick={onCloseClick}
    />
  );

  return (
    <div
      className={clsx(
        className,
        'relative w-full px-6 py-4 transition-all duration-normal',
        {
          'bg-gray-100': mode === 'info',
          'bg-negative-300': mode === 'error',
        },
      )}
    >
      <div className="flex flex-col items-center justify-normal md:flex-row md:justify-between">
        <div
          className={clsx(
            'flex w-full items-start justify-between md:w-auto md:justify-normal',
          )}
        >
          <div className="text-gray-900 text-1">{title}</div>
          {isTablet && closeButtonComponent}
        </div>
        <div
          className={clsx(
            'mt-2 flex w-full items-center justify-between md:mt-0 md:w-auto md:justify-normal',
          )}
        >
          <div className="flex items-center">
            <Link
              {...linkProps}
              className="!hover:text-base-white text-sm font-semibold text-gray-900 underline sm:hover:no-underline"
            />
            <Button
              {...buttonProps}
              className="ml-4 md:mr-7"
              mode="primarySolid"
              size="small"
            />
          </div>
          {!isTablet && closeButtonComponent}
          {onCaretClick && (
            <button
              type="button"
              className="ml-4 flex items-center justify-center p-2 text-gray-900 transition-colors sm:hover:text-blue-400"
              aria-label={formatText({
                id: 'ariaLabel.calamityBanner',
              })}
              onClick={onCaretClick}
            >
              <CaretRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalamityBannerContent;
