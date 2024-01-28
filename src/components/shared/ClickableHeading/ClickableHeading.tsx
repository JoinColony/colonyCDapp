import React, { type ReactNode } from 'react';

import Heading, { type Appearance } from '~shared/Heading/index.ts';
import Icon from '~shared/Icon/index.ts';
import NavLink from '~shared/NavLink/index.ts';

import styles from './ClickableHeading.css';

interface Props {
  linkTo: string;
  children?: ReactNode;
  appearance?: Pick<Appearance, 'margin'>;
}

const displayName = 'ClickableHeading';

const ClickableHeading = ({ linkTo, children, appearance }: Props) => {
  return (
    <div className={styles.heading}>
      <Heading appearance={{ size: 'small', weight: 'bold', ...appearance }}>
        <NavLink to={linkTo}>
          <span className={styles.contents}>
            {children}
            <span className={styles.icon}>
              <Icon name="caret-right" />
            </span>
          </span>
        </NavLink>
      </Heading>
    </div>
  );
};

ClickableHeading.displayName = displayName;

export default ClickableHeading;
