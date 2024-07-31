import clsx from 'clsx';
import React, { type FC } from 'react';

import Breadcrumbs from '~v5/shared/Breadcrumbs/index.ts';

import { type PageHeadingProps } from './types.ts';

const displayName = 'v5.frame.PageLayout.partials.PageHeading';

const PageHeading: FC<PageHeadingProps> = ({ breadcrumbs, className }) => (
  <div className={clsx(className, 'modal-blur')}>
    <Breadcrumbs items={breadcrumbs} />
  </div>
);

PageHeading.displayName = displayName;

export default PageHeading;
