import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { FC } from 'react';

import TeamCard from '../TeamCard';

import { TeamCardListProps } from './types';

const TeamCardList: FC<TeamCardListProps> = ({ items, className }) => (
  <ul className={clsx(className, 'flex flex-wrap gap-6')}>
    {items.map(({ key, ...item }) => (
      <motion.li
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        key={key}
        className="w-full sm:w-[calc(50%-.75rem)]"
      >
        <TeamCard {...item} />
      </motion.li>
    ))}
  </ul>
);

export default TeamCardList;
