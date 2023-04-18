import React, { PropsWithChildren } from 'react';

import clsx from 'clsx';
import styles from './ThreeColumns.module.css';
import { ThreeColumnsProps } from './types';

const ThreeColumns: React.FC<PropsWithChildren<ThreeColumnsProps>> = ({
  leftAside,
  topRow,
  children,
  rightAside,
  withSlider,
}) => (
  <div className={clsx(styles.threeColumns, withSlider ? 'md:grid-rows-[auto_auto_1fr]' : 'md:grid-rows-[auto_1fr]')}>
    <aside className="hidden md:block md:mr-6 lg:mr-[3.25rem] row-span-full">{leftAside}</aside>
    <div className="md:col-span-2 md:row-start-1 md:col-start-2">{topRow}</div>
    {withSlider && <div className="md:col-span-2 md:col-start-2 lg:col-auto">{withSlider}</div>}
    <div className={withSlider ? 'row-start-4 md:row-start-auto md:col-start-2' : 'md:row-start-2 md:col-start-2'}>
      {children}
    </div>
    <aside
      className={
        withSlider ? 'md:row-span-full md:row-start-3 md:col-start-3 lg:row-start-2' : 'row-start-2 md:row-start-aut'
      }
    >
      {rightAside}
    </aside>
  </div>
);

export default ThreeColumns;
