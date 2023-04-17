import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { PageTitleProps } from './types';
import styles from './PageTitle.module.css';

const displayName = 'Extensions.PageTitle';

const MSG = defineMessages({
  pay: {
    id: `${displayName}.pay`,
    defaultMessage: 'Pay',
  },
  decide: {
    id: `${displayName}.decide`,
    defaultMessage: 'Decide',
  },
  manage: {
    id: `${displayName}.manage`,
    defaultMessage: 'Manage',
  },
});

const PageTitle = ({ title, subtitle }: PageTitleProps) => (
  <div className={styles.wrapper}>
    <div className="flex gap-12 items-baseline">
      <div className="max-w-[54.5rem]">
        <h1 className="text-xl lg:text-2xl text-gray-900 mb-4 font-semibold">{title}</h1>
        {subtitle && <h2 className="text-xl text-gray-600 leading-normal">{subtitle}</h2>}
      </div>
      <div className="hidden lg:block">
        {/* it's placeholder for sub navigation */}
        <ul className="flex gap-8 font-semibold text-md text-gray-700">
          <li>
            <FormattedMessage {...MSG.pay} />
          </li>
          <li>
            <FormattedMessage {...MSG.decide} />
          </li>
          <li>
            <FormattedMessage {...MSG.manage} />
          </li>
        </ul>
      </div>
    </div>
  </div>
);

PageTitle.displayName = displayName;

export default PageTitle;
