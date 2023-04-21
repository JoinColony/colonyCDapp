import React from 'react';
import classNames from 'classnames';

import { PageTitleProps } from './types';
import styles from './PageTitle.module.css';

const displayName = 'PageTitle';

const PageTitle = ({ title, subtitle }: PageTitleProps) => (
  <div className={classNames(styles.wrapper)}>
    <div className="flex gap-12">
      <div className="max-w-[872px]">
        <h1 className="text-2xl text-gray-900 mb-4 font-semibold">{title}</h1>
        <h2 className="text-xl text-gray-600 leading-normal">{subtitle}</h2>
      </div>
      <div className="hidden lg:block">Sub navigation placeholder</div>
    </div>
  </div>
);

PageTitle.displayName = displayName;

export default PageTitle;
