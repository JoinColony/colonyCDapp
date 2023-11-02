import React, { FC } from 'react';
import clsx from 'clsx';

import PageHeading from '../PageHeading';

import { PageHeaderProps } from './types';

const displayName = 'v5.frame.PageLayout.partials.PageHeader';

const PageHeader: FC<PageHeaderProps> = ({
  userNavigation,
  className,
  breadcrumbs,
  title,
}) => {
  return (
    <header
      className={clsx(className, 'flex justify-between items-start gap-4')}
    >
      <PageHeading
        className="flex-grow"
        breadcrumbs={breadcrumbs}
        title={title}
      />
      <div className="flex-shrink-0">
        <div>{userNavigation}</div>
      </div>
    </header>
  );
};

PageHeader.displayName = displayName;

export default PageHeader;
