import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { type FC } from 'react';

import TeamCard from '../TeamCard/index.ts';

import { type TeamCardListProps } from './types.ts';

const TeamCardList: FC<TeamCardListProps> = ({ items, className }) => (
  <ul className={clsx(className, 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6')}>
    {items.map(({ key, ...item }) => (
      <motion.li
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        key={key}
      >
        <TeamCard {...item} />
      </motion.li>
    ))}
  </ul>
);

export default TeamCardList;
