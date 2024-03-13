import React, { type PropsWithChildren } from 'react';

// @NOTE if you use grid-cols in tailwind, the rows property doesn't get applied, so I had to use CSS
import styles from './Blocks.module.css';

export const ActionTitle = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return <h3 className="mb-2 text-2xl font-bold text-gray-900">{children}</h3>;
};

export const ActionSubtitle = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return (
    <div className="mb-7 flex whitespace-pre-wrap text-md">{children}</div>
  );
};

export const ActionDataGrid = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return <div className={styles.actionGrid}>{children}</div>;
};
