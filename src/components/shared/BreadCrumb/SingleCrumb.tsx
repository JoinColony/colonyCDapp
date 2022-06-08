import React, { isValidElement } from 'react';
import { FormattedMessage } from 'react-intl';

import NavLink from '~shared/NavLink';

import { CrumbText } from './BreadCrumb';
import styles from './BreadCrumb.css';

interface Props {
  crumbText: CrumbText;
  crumbLink?: string;
  lastCrumb?: boolean;
}

const SingleCrumb = ({ crumbText, crumbLink, lastCrumb }: Props) => {
  const crumbTitle = typeof crumbText === 'string' ? crumbText : '';
  const text =
    typeof crumbText === 'string' || isValidElement(crumbText) ? (
      crumbText
    ) : (
      <FormattedMessage {...crumbText} />
    );

  if (lastCrumb) {
    return (
      <div className={styles.elementLast} title={crumbTitle}>
        <span className={styles.breadCrumble}>
          {crumbLink ? (
            <NavLink className={styles.invisibleLink} to={crumbLink}>
              {text}
            </NavLink>
          ) : (
            text
          )}
        </span>
      </div>
    );
  }
  return (
    <div className={styles.element} title={crumbTitle}>
      <span className={styles.breadCrumble}>
        {crumbLink ? (
          <NavLink className={styles.invisibleLink} to={crumbLink}>
            {text}
          </NavLink>
        ) : (
          text
        )}
      </span>
      <span className={styles.arrow}>&gt;</span>
    </div>
  );
};

SingleCrumb.displayName = 'BreadCrumb.SingleCrumb';

export default SingleCrumb;
