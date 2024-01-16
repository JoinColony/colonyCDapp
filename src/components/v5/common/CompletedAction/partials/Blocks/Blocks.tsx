import React, { PropsWithChildren } from 'react';

// @NOTE if you use grid-cols in tailwind, the rows property doesn't get applied, so I had to use CSS
import styles from './Blocks.module.css';

export const ActionTitle = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return <h3 className="text-2xl font-bold mb-2 text-gray-900">{children}</h3>;
};

export const ActionSubtitle = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return (
    <div className="mb-7 text-md flex whitespace-pre-wrap">{children}</div>
  );
};

export const ActionDataGrid = ({
  children,
}: PropsWithChildren<Record<never, any>>) => {
  return <div className={styles.actionGrid}>{children}</div>;
};
