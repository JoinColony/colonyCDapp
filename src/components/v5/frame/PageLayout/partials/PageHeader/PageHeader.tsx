import React, { FC } from 'react';
import clsx from 'clsx';

import PageHeading from '../PageHeading';

import { PageHeaderProps } from './types';

const displayName = 'v5.frame.PageLayout.partials.PageHeader';

const PageHeader: FC<PageHeaderProps> = ({
  userNavigation,
  className,
  pageHeadingProps,
}) => {
  return (
    <header
      className={clsx(className, 'flex items-start', {
        'justify-between gap-4': pageHeadingProps,
        'justify-end': !pageHeadingProps,
      })}
    >
      {pageHeadingProps && (
        <PageHeading className="flex-grow" {...pageHeadingProps} />
      )}
      <div className="ml-auto flex-shrink-0">{userNavigation}</div>
    </header>
  );
};

PageHeader.displayName = displayName;

export default PageHeader;
