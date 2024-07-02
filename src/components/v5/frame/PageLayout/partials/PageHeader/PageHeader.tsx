import clsx from 'clsx';
import React, { type FC } from 'react';

import PageHeading from '../PageHeading/index.ts';

import { type PageHeaderProps } from './types.ts';

const displayName = 'v5.frame.PageLayout.partials.PageHeader';

const PageHeader: FC<PageHeaderProps> = ({
  userNavigation,
  className,
  pageHeadingProps,
}) => {
  return (
    <header
      className={clsx(className, 'flex', {
        'justify-between gap-4': pageHeadingProps && pageHeadingProps.title,
        'justify-end': !pageHeadingProps,
        'items-center':
          pageHeadingProps &&
          !pageHeadingProps.title &&
          pageHeadingProps.breadcrumbs,
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
