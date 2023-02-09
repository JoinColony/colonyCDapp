import React, { ReactNode } from 'react';

import Tag from './Tag';

import styles from './AmountTag.css';

const displayName = 'Tag.AmountTag';

interface AmountTagProps {
  children: ReactNode;
}
const AmountTag = ({ children }: AmountTagProps) => (
  <span className={styles.main}>
    <Tag
      appearance={{
        theme: 'primary',
        colorSchema: 'inverted',
        fontSize: 'tiny',
        margin: 'none',
      }}
    >
      {children}
    </Tag>
  </span>
);

AmountTag.displayName = displayName;

export default AmountTag;
