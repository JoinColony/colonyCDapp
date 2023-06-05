import React, { FC, PropsWithChildren } from 'react';

import clsx from 'clsx';
import styles from './ThreeColumns.module.css';
import { ThreeColumnsProps } from './types';

const displayName = 'frame.Extensions.ThreeColumns';

const ThreeColumns: FC<PropsWithChildren<ThreeColumnsProps>> = ({
  leftAside,
  topRow,
  children,
  rightAside,
  withSlider,
}) => (
  <div className={clsx(styles.threeColumns, withSlider ? 'sm:grid-rows-[auto_auto_1fr]' : 'sm:grid-rows-[auto_1fr]')}>
    <aside className="hidden sm:block sm:mr-6 lg:mr-[3.25rem] row-span-full">{leftAside}</aside>
    <div className="sm:col-span-2 sm:row-start-1 sm:col-start-2">{topRow}</div>
    {withSlider && <div className="sm:col-span-2 sm:col-start-2 lg:col-auto mb-4">{withSlider}</div>}
    <div className={withSlider ? 'row-start-4 sm:row-start-auto sm:col-start-2' : 'sm:row-start-2 sm:col-start-2'}>
      {children}
    </div>
    <aside
      className={
        withSlider ? 'sm:row-span-full sm:row-start-3 sm:col-start-3 lg:row-start-2' : 'row-start-2 sm:row-start-aut'
      }
    >
      {rightAside}
    </aside>
  </div>
);

ThreeColumns.displayName = displayName;

export default ThreeColumns;
