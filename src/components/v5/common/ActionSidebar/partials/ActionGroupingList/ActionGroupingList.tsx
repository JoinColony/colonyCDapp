import React, { type FC } from 'react';

import {
  ActionGroupingItem,
  type ActionGroupingItemProps,
} from './ActionGroupingItem.tsx';

interface ActionGroupingListProps {
  items: Omit<ActionGroupingItemProps, 'color'>[];
  color: ActionGroupingItemProps['color'];
}

export const ActionGroupingList: FC<ActionGroupingListProps> = ({ items }) => {
  return (
    <section className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
      {items.map((item) => (
        <ActionGroupingItem key={item.title} {...item} />
      ))}
    </section>
  );
};
