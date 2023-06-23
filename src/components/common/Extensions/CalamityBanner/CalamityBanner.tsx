import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';

import { CalamityBannerProps } from './types';
import Link from '~v5/shared/Link';
import Icon from '~shared/Icon';
import { useCalamityBanner } from './hooks';
import styles from './CalamityBanner.module.css';
import Button from '~v5/shared/Button';

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

  return (
    <>
      {showBanner && (
        <div className="w-full bg-blue-400 px-6 py-[1.0625rem] h-[7.25rem] md:h-[4.25rem]">
          <div className={styles.calamityBannerInner}>
            <div className="flex justify-between w-full md:w-auto md:justify-normal items-start">
              <div className="text-base-white text-1">{children}</div>
              <button
                type="button"
                className="text-base-white md:hidden"
                onClick={() => setShowBanner(false)}
              >
                <Icon name="close" appearance={{ size: 'extraTiny' }} />
              </button>
            </div>
            <div className="flex items-center justify-between md:justify-normal w-full md:w-auto mt-2 md:mt-0">
              <Link
                to="https://docs.colony.io/use/advanced-features/upgrade-colony-and-extensions"
                className="text-2 text-base-white underline hover:text-base-white hover:no-underline"
              >
                {formatMessage({ id: linkName })}
              </Link>
              <Button
                className="md:mr-7 ml-4"
                mode="primaryOutlineFull"
                disabled={isButtonDisabled}
                onClick={onUpgrade}
              >
                {formatMessage({ id: buttonName })}
              </Button>
              {/* @TODO button */}
              <button
                type="button"
                className="text-base-white transition-all duration-normal hidden md:flex hover:text-gray-300"
                onClick={() => setShowBanner(false)}
              >
                <Icon name="close" appearance={{ size: 'extraTiny' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CalamityBanner.displayName = displayName;

export default CalamityBanner;
