import React from 'react';
import { FormattedDate } from 'react-intl';

import styles from './CaptionElement.css';

interface Props {
  displayMonth: Date;
}

const CaptionElement = ({ displayMonth }: Props) => (
  <div className={styles.main}>
    <div className={styles.monthName}>
      <FormattedDate value={displayMonth} month="long" year="numeric" />
    </div>
  </div>
);

CaptionElement.displayName = 'DatePicker.CaptionElement';

export default CaptionElement;
