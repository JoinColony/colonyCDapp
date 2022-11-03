import React from 'react';

import { Color, hexMap } from '~types';

import styles from './ColorTag.css';

interface Props {
  color: Color;
}

const displayName = 'ColorTag';

const ColorTag = ({ color }: Props) => (
  <div className={styles.main}>
    <div className={styles.color} style={{ backgroundColor: hexMap[color] }} />
  </div>
);

ColorTag.displayName = displayName;

export default ColorTag;
