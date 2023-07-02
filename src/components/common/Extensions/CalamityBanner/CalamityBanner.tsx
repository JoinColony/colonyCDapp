import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { CalamityBannerProps } from './types';
import Link from '~v5/shared/Link';
import { useCalamityBanner } from './hooks';
import styles from './CalamityBanner.module.css';
import Button, { CloseButton } from '~v5/shared/Button';
import { useTablet } from '~hooks';

const displayName = 'common.Extensions.CalamityBanner';

const CalamityBanner: FC<PropsWithChildren<CalamityBannerProps>> = ({
  children,
  linkName,
  buttonName,
  isButtonDisabled,
  onUpgrade,
}) => {
  const { formatMessage } = useIntl();
  const { showBanner, setShowBanner } = useCalamityBanner();
  const isTablet = useTablet();

  return (
    <>
      {showBanner && (
        <div className="w-full bg-blue-400 px-6 py-4 min-h-[7.25rem] md:min-h-[4.25rem]">
          <div className={styles.calamityBannerInner}>
            <div className="flex justify-between w-full md:w-auto md:justify-normal items-start">
              <div className="text-base-white text-1">{children}</div>
              {isTablet && (
                <CloseButton
                  className="text-base-white -mr-4"
                  onClick={() => setShowBanner(false)}
                />
              )}
            </div>
            <div className="flex items-center justify-between md:justify-normal w-full md:w-auto mt-2 md:mt-0">
              <Link
                to="https://docs.colony.io/use/advanced-features/upgrade-colony-and-extensions"
                className="text-2 text-base-white underline !hover:text-base-white hover:no-underline"
              >
                {formatMessage({ id: linkName })}
              </Link>
              <Button
                className="md:mr-7 ml-4"
                mode="primaryOutline"
                disabled={isButtonDisabled}
                onClick={onUpgrade}
              >
                {formatMessage({ id: buttonName })}
              </Button>
              {!isTablet && (
                <CloseButton
                  className="text-base-white -mr-4"
                  onClick={() => setShowBanner(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CalamityBanner.displayName = displayName;

export default CalamityBanner;
