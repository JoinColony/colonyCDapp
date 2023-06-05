import React from 'react';

import SubNavigation from '../SubNavigation/SubNavigation';

import { PageTitleProps } from './types';
import styles from './PageTitle.module.css';

const displayName = 'common.Extensions.PageTitle';

const PageTitle = ({ title, subtitle }: PageTitleProps) => (
  <div className={styles.wrapper}>
    <div className="flex gap-12 items-baseline justify-between">
      <div className="sm:max-w-[54.5rem]">
        <h1 className="heading-3">{title}</h1>
        {subtitle && <h2 className="text-lg text-gray-600 leading-normal">{subtitle}</h2>}
      </div>
      <div className="hidden md:block">
        <SubNavigation />
      </div>
    </div>
  </div>
);

PageTitle.displayName = displayName;

export default PageTitle;
