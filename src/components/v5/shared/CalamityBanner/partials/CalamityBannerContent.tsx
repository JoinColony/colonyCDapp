import React, { FC } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import Link from '~v5/shared/Link';
import styles from '../CalamityBanner.module.css';
import Button, { CloseButton } from '~v5/shared/Button';
import Icon from '~shared/Icon';
import { CalamityBannerContentProps } from '../types';
import { useTablet } from '~hooks';

const CalamityBannerContent: FC<CalamityBannerContentProps> = ({
  buttonName,
  linkName,
  linkUrl,
  mode,
  onClick,
  title,
  isButtonDisabled,
  activeElement,
  setShowBanner,
  handleBannerChange,
  index,
  itemsLength,
}) => {
  const isTablet = useTablet();
  const { formatMessage } = useIntl();

  const CloseButtonComponent = (
    <CloseButton
      className="text-gray-900 hover:text-blue-400 sm:-mr-4"
      onClick={() => setShowBanner(false)}
    />
  );

  return (
    <div
      className={clsx(
        'relative inset-0 w-full px-6 py-4 transition-all duration-normal',
        {
          'bg-gray-100': mode === 'info',
        },
        {
          'bg-negative-300': mode === 'error',
        },
        {
          'block sm:opacity-100 sm:visible': activeElement === index,
        },
        {
          'hidden sm:block sm:opacity-0 sm:invisible': activeElement !== index,
        },
      )}
    >
      <div className={styles.calamityBannerInner}>
        <div className={clsx(styles.calamityBannerRow, 'items-start')}>
          <div className="text-gray-900 text-1">{formatMessage(title)}</div>
          {isTablet && CloseButtonComponent}
        </div>
        <div
          className={clsx(
            styles.calamityBannerRow,
            'items-center mt-2 md:mt-0',
          )}
        >
          <div className="flex items-center">
            <Link
              to={linkUrl}
              className="text-2 text-gray-900 underline !hover:text-base-white hover:no-underline"
            >
              {formatMessage({ id: linkName })}
            </Link>
            <Button
              className="md:mr-7 ml-4"
              mode="primarySolid"
              size="small"
              disabled={isButtonDisabled}
              onClick={onClick}
            >
              {formatMessage({ id: buttonName })}
            </Button>
          </div>
          {!isTablet && CloseButtonComponent}
          {itemsLength > 1 && (
            <button
              type="button"
              className="flex items-center justify-center p-2 ml-4 
                        text-gray-900 transition-colors hover:text-blue-400"
              aria-label={formatMessage({
                id: 'ariaLabel.calamityBanner',
              })}
              onClick={handleBannerChange}
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
