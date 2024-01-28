import clsx from 'clsx';
import React, { type FC } from 'react';

import Breadcrumbs from '~v5/shared/Breadcrumbs/index.ts';

import { type PageHeadingProps } from './types.ts';

const displayName = 'v5.frame.PageLayout.partials.PageHeading';

const PageHeading: FC<PageHeadingProps> = ({
  breadcrumbs,
  title,
  className,
}) => (
  <div className={className}>
    <Breadcrumbs className={clsx({ 'mb-2': title })} items={breadcrumbs} />
    {title && <h1 className="heading-3 text-gray-900">{title}</h1>}
  </div>
);

PageHeading.displayName = displayName;

export default PageHeading;
