import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import { PageTitleProps } from './types';
import SubNavigation from '~v5/common/SubNavigation';

const displayName = 'v5.common.PageTitle';

const PageTitle: FC<PageTitleProps> = ({ title, subtitle }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex gap-12 items-baseline justify-between">
        <div className="sm:max-w-[54.5rem]">
          <h1 className="heading-3">{formatMessage(title)}</h1>
          {subtitle && (
            <h2 className="text-lg text-gray-600 mt-1">
              {formatMessage(subtitle)}
            </h2>
          )}
        </div>
        <div className="hidden md:block">
          <SubNavigation />
        </div>
      </div>
    </div>
  );
};

PageTitle.displayName = displayName;

export default PageTitle;
