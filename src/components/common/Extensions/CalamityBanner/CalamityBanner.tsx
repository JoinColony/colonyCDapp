import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import { CalamityBannerProps } from './types';
import Link from '~shared/Extensions/Link';
import Button from '~shared/Extensions/Button';
import Icon from '~shared/Icon';
import { useCalamityBanner } from './hooks';

const displayName = 'common.Extensions.CalamityBanner';

const CalamityBanner: FC<PropsWithChildren<CalamityBannerProps>> = ({ children, linkName, buttonName }) => {
  const { formatMessage } = useIntl();
  const { showBanner, setShowBanner } = useCalamityBanner();

  return (
    <>
      {showBanner && (
        <div
          className="w-[23.75rem] bg-blue-400 px-6 py-[1.0625rem] flex flex-col md:flex-row items-center
   justify-normal md:justify-between absolute top-0 left-0 right-0 md:w-full h-[7.25rem] md:h-[4.25rem]"
        >
          <div className="flex justify-between md:justify-normal items-start">
            <div className="text-base-white font-medium text-md">{children}</div>
            <button type="button" className="text-base-white md:hidden" onClick={() => setShowBanner(false)}>
              <Icon name="close" appearance={{ size: 'extraTiny' }} />
            </button>
          </div>
          <div className="flex items-center justify-between md:justify-normal w-full md:w-auto">
            <Link to="http://example.pl" className="font-semibold text-sm text-base-white underline">
              {formatMessage({ id: linkName })}
            </Link>
            <Button type="button" className="md:mr-[1.6875rem] ml-4" mode="primaryOutline">
              {formatMessage({ id: buttonName })}
            </Button>
            <button
              type="button"
              className="text-base-white transition-all duration-normal hidden md:flex hover:text-gray-300"
              onClick={() => setShowBanner(false)}
            >
              <Icon name="close" appearance={{ size: 'extraTiny' }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

CalamityBanner.displayName = displayName;

export default CalamityBanner;
