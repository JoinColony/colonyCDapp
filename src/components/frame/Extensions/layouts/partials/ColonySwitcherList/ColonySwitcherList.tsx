import React, { FC } from 'react';

import ColonySwitcherItem from '../ColonySwitcherItem/index.ts';

import { ColonySwitcherListProps } from './types.ts';

const displayName = 'frame.Extensions.partials.ColonySwitcherList';

const ColonySwitcherList: FC<ColonySwitcherListProps> = ({ items }) => (
  <ul className="w-full flex flex-col gap-2">
    {items.map(({ key, ...item }) => (
      <li key={key}>
        <ColonySwitcherItem {...item} />
      </li>
    ))}
  </ul>
);

ColonySwitcherList.displayName = displayName;

export default ColonySwitcherList;
