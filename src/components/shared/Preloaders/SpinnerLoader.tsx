import React from 'react';

import { Message, UniversalMessageValues } from '~types';
import { getMainClasses } from '~utils/css';
import { formatText } from '~utils/intl';

import styles from './SpinnerLoader.css';

export interface Appearance {
  size: 'small' | 'medium' | 'large' | 'huge' | 'massive';
  theme?: 'grey' | 'primary';
  layout?: 'horizontal';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Text to display while loading */
  loadingText?: Message;

  /** Values for loading text (react-intl interpolation) */
  textValues?: UniversalMessageValues;
}

const SpinnerLoader = ({ appearance = { size: 'small', theme: 'grey' }, loadingText, textValues }: Props) => {
  return (
    <div className={getMainClasses(appearance, styles)}>
      <div className={styles.loader} />
      {loadingText && (
        <div className={styles.loadingTextContainer}>
          <div>{formatText(loadingText, textValues)}</div>
        </div>
      )}
    </div>
  );
};

export default SpinnerLoader;
