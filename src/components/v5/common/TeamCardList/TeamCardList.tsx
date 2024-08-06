import clsx from 'clsx';
import React, { type FC } from 'react';

import TeamCard from '../TeamCard/index.ts';

import { type TeamCardListProps } from './types.ts';

const TeamCardList: FC<TeamCardListProps> = ({ items, className }) => (
  <ul
    className={clsx(
      className,
      'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
    )}
  >
    {items.map(({ key, ...item }) => (
      <TeamCard key={key} {...item} />
    ))}
  </ul>
);

export default TeamCardList;
