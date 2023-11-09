/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react';

import StakesTabItem from '../StakesTabItem';
import { StakesTabContentListProps } from './types';

const StakesTabContentList: FC<StakesTabContentListProps> = ({ items }) =>
  items.length ? (
    <ul className="flex flex-col">
      {items.map(({ key, motionDataId: _, ...item }) => (
        <li
          key={key}
          className="py-4 border-b border-b-gray-200 last:border-b-0"
        >
          <StakesTabItem {...item} />
        </li>
      ))}
    </ul>
  ) : null;

export default StakesTabContentList;
