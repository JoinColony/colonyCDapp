import React, { FC, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import { CalamityBannerProps } from './types';
import Link from '~shared/Link';
import Button from '~shared/Extensions/Button';

const displayName = 'common.Extensions.CalamityBanner';
// @TODO: add x icon

const CalamityBanner: FC<PropsWithChildren<CalamityBannerProps>> = ({ children, linkName, buttonName }) => {
  const { formatMessage } = useIntl();
  return (
    <div
      className="w-full h-[4.25rem] bg-blue-400 px-6 py-[1.0625rem] flex flex-row items-center
    justify-between absolute top-0 left-0 right-0"
    >
      <div className="text-base-white font-medium text-md">{children}</div>
      <div className="flex items-center">
        <Link to="http://example.pl" className="font-semibold text-sm text-base-white underline">
          {formatMessage({ id: linkName })}
        </Link>
        <Button type="button" className="mr-[1.6875rem] ml-4" mode="primaryOutline">
          {formatMessage({ id: buttonName })}
        </Button>
        <button type="button">x</button>
      </div>
    </div>
  );
};

CalamityBanner.displayName = displayName;

export default CalamityBanner;
