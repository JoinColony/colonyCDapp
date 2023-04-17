import React from 'react';

import styles from './TwoColumns.module.css';
import { TwoColumnsProps } from './types';

const TwoColumns: React.FC<TwoColumnsProps> = ({ aside, mainColumn }) => (
  <div className={styles.twoColumns}>
    <aside className="hidden md:block">{aside}</aside>
    <div>{mainColumn}</div>
  </div>
);

export default TwoColumns;
