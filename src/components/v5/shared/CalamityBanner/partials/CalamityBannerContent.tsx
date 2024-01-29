import clsx from 'clsx';
import React, { type FC } from 'react';

import { useTablet } from '~hooks/index.ts';
import Icon from '~shared/Icon/index.ts';
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
      <div className="flex flex-col md:flex-row items-center justify-normal md:justify-between">
        <div
          className={clsx(
            'flex justify-between w-full md:w-auto md:justify-normal items-start',
          )}
        >
          <div className="text-gray-900 text-1">{title}</div>
          {isTablet && closeButtonComponent}
        </div>
        <div
          className={clsx(
            'flex justify-between w-full md:w-auto md:justify-normal items-center mt-2 md:mt-0',
          )}
        >
          <div className="flex items-center">
            <Link
              {...linkProps}
              className="text-2 text-gray-900 underline !hover:text-base-white sm:hover:no-underline"
            />
            <Button
              {...buttonProps}
              className="md:mr-7 ml-4"
              mode="primarySolid"
              size="small"
            />
          </div>
          {!isTablet && closeButtonComponent}
          {onCaretClick && (
            <button
              type="button"
              className="flex items-center justify-center p-2 ml-4 text-gray-900 transition-colors sm:hover:text-blue-400"
              aria-label={formatText({
                id: 'ariaLabel.calamityBanner',
              })}
              onClick={onCaretClick}
            >
              <Icon name="caret-right" appearance={{ size: 'tiny' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalamityBannerContent;
