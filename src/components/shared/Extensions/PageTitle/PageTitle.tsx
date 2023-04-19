import React from 'react';
import SubNavigation from '../SubNavigation/SubNavigation';

import { PageTitleProps } from './types';
import styles from './PageTitle.module.css';

const displayName = 'Extensions.PageTitle';

const PageTitle = ({ title, subtitle }: PageTitleProps) => (
  <div className={styles.wrapper}>
    <div className="flex gap-12 items-baseline">
      <div className="max-w-[54.5rem]">
        <h1 className="text-xl lg:text-2xl text-gray-900 mb-4 font-semibold">{title}</h1>
        {subtitle && <h2 className="text-xl text-gray-600 leading-normal">{subtitle}</h2>}
      </div>
      <div className="hidden lg:block">
        <SubNavigation />
      </div>
    </div>
  </div>
);

PageTitle.displayName = displayName;

export default PageTitle;
