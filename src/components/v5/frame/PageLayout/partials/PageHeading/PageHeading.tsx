import clsx from 'clsx';
import React, { type FC } from 'react';

import Breadcrumbs from '~v5/shared/Breadcrumbs/index.ts';

import { type PageHeadingProps } from './types.ts';

const displayName = 'v5.frame.PageLayout.partials.PageHeading';

const PageHeading: FC<PageHeadingProps> = ({ title, className }) => (
  <div className={clsx(className, 'modal-blur')}>
    <Breadcrumbs className={clsx({ 'mb-2': title })} />
    {title && <h1 className="text-gray-900 heading-3">{title}</h1>}
  </div>
);

PageHeading.displayName = displayName;

export default PageHeading;
