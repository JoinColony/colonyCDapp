import React, { FC, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';

import { CalamityBannerProps } from './types';
import Link from '~v5/shared/Link';
import { useCalamityBanner } from './hooks';
import styles from './CalamityBanner.module.css';
import Button, { CloseButton } from '~v5/shared/Button';
import { useTablet } from '~hooks';
import Icon from '~shared/Icon';

const displayName = 'common.Extensions.CalamityBanner';

const CalamityBanner: FC<CalamityBannerProps> = ({ items }) => {
  const { formatMessage } = useIntl();
  const { showBanner, setShowBanner } = useCalamityBanner();
  const isTablet = useTablet();
  const [activeElement, setActiveElement] = useState(0);

  const CloseButtonComponent = (
    <CloseButton
      className="text-base-white hover:text-gray-300 sm:-mr-4"
      onClick={() => setShowBanner(false)}
    />
  );

  const handleBannerChange = useCallback(() => {
    if (activeElement === items.length - 1) {
      setActiveElement(0);
    } else {
      setActiveElement(activeElement + 1);
    }
  }, [activeElement, items.length]);

  useEffect(() => {
    items.forEach(({ mode }, index) => {
      if (mode === 'error') {
        setActiveElement(index);
      }
    });
  }, [items]);

  return (
    <>
      {showBanner && (
        <div className="overflow-hidden relative min-h-[7.25rem] md:min-h-[4.25rem]">
          {items.map(
            (
              {
                buttonName,
                linkName,
                linkUrl,
                mode,
                onClick,
                isButtonDisabled,
                title,
                id,
              },
              index,
            ) => (
              <div
                key={id}
                className={clsx(
                  'relative sm:absolute inset-0 w-full px-6 py-4 transition-all duration-normal',
                  {
                    'bg-blue-400': mode === 'info',
                  },
                  {
                    'bg-negative-400': mode === 'error',
                  },
                  {
                    'block sm:opacity-100 sm:visible': activeElement === index,
                  },
                  {
                    'hidden sm:block sm:opacity-0 sm:invisible':
                      activeElement !== index,
                  },
                )}
              >
                <div className={styles.calamityBannerInner}>
                  <div className="flex justify-between w-full md:w-auto md:justify-normal items-start">
                    <div className="text-base-white text-1">
                      {formatMessage(title)}
                    </div>
                    {isTablet && CloseButtonComponent}
                  </div>
                  <div className="flex items-center justify-between md:justify-normal w-full md:w-auto mt-2 md:mt-0">
                    <div className="flex items-center">
                      <Link
                        to={linkUrl}
                        className="text-2 text-base-white underline !hover:text-base-white hover:no-underline"
                      >
                        {formatMessage({ id: linkName })}
                      </Link>
                      <Button
                        className="md:mr-7 ml-4"
                        mode="primaryOutline"
                        disabled={isButtonDisabled}
                        onClick={onClick}
                      >
                        {formatMessage({ id: buttonName })}
                      </Button>
                    </div>
                    {!isTablet && CloseButtonComponent}
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="flex items-center justify-center p-2 ml-4 
                        text-base-white transition-colors hover:text-gray-300"
                        aria-label={formatMessage({
                          id: 'ariaLabel.calamityBanner',
                        })}
                        onClick={handleBannerChange}
                      >
                        <Icon
                          name="caret-right"
                          appearance={{ size: 'tiny' }}
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </>
  );
};

CalamityBanner.displayName = displayName;

export default CalamityBanner;
