import clsx from 'clsx';
import React, { FC } from 'react';

import WidgetBox from '../WidgetBox/index.ts';

import { WidgetBoxListProps } from './types.ts';

const displayName = 'v5.common.WidgetBoxList';

const WidgetBoxList: FC<WidgetBoxListProps> = ({
  items,
  className,
  isVertical,
}) => (
  <ul
    className={clsx(
      className,
      'flex flex-col items-center gap-[1.125rem] w-full',
      {
        'sm:flex-row': !isVertical,
      },
    )}
  >
    {items.map(({ key, ...item }) => (
      <li key={key} className="w-full">
        <WidgetBox {...item} />
      </li>
    ))}
  </ul>
);

WidgetBoxList.displayName = displayName;

export default WidgetBoxList;
