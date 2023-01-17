import React, { ReactNode } from 'react';

import Heading, { Appearance } from '~shared/Heading';
import NavLink from '~shared/NavLink';
import Icon from '~shared/Icon';

import { Icons } from '~constants';

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
              <Icon name={Icons.CaretRight} />
            </span>
          </span>
        </NavLink>
      </Heading>
    </div>
  );
};

ClickableHeading.displayName = displayName;

export default ClickableHeading;
