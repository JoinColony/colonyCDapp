import React from 'react';
import { defineMessages } from 'react-intl';

import { Icons } from '~constants';

import styles from './NavbarElement.css';

import Icon from '../Icon';

const MSG = defineMessages({
  nextMonth: {
    id: 'DatePicker.NavbarElement.nextMonth',
    defaultMessage: 'Go to next month',
  },
  prevMonth: {
    id: 'DatePicker.NavbarElement.prevMonth',
    defaultMessage: 'Go to previous month',
  },
});

interface Props {
  onPreviousClick: () => void;
  onNextClick: () => void;
}

const NavbarElement = ({ onPreviousClick, onNextClick }: Props) => (
  <div className={styles.main}>
    <button
      className={styles.navButton}
      type="button"
      onClick={() => onPreviousClick()}
    >
      <Icon
        name={Icons.CaretLeft}
        appearance={{ size: 'small' }}
        title={MSG.nextMonth}
      />
    </button>
    <button
      className={styles.navButton}
      type="button"
      onClick={() => onNextClick()}
    >
      <Icon
        name={Icons.CaretRight}
        appearance={{ size: 'small' }}
        title={MSG.prevMonth}
      />
    </button>
  </div>
);

NavbarElement.displayName = 'DatePicker.NavbarElement';

export default NavbarElement;
