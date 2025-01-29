import React from 'react';

import { type Message, type UniversalMessageValues } from '~types/index.ts';
import { getMainClasses } from '~utils/css/index.ts';
import { formatText } from '~utils/intl.ts';

import styles from './SpinnerLoader.module.css';

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

const SpinnerLoader = ({
  appearance = { size: 'small', theme: 'grey' },
  loadingText,
  textValues,
}: Props) => {
  return (
    <div
      data-testid="spinner-loader"
      className={getMainClasses(appearance, styles)}
    >
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
