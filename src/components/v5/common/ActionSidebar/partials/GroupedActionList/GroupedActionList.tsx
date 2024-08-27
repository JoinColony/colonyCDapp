import React, { type FC } from 'react';

import {
  GroupedActionItem,
  type GroupedActionItemProps,
} from './GroupedActionItem.tsx';

interface GroupedActionListProps {
  items: Omit<GroupedActionItemProps, 'color'>[];
  color: GroupedActionItemProps['color'];
}

export const GroupedActionList: FC<GroupedActionListProps> = ({
  items,
  color,
}) => {
  return (
    <section className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
      {items.map(({ title, description, Icon, action }) => (
        <GroupedActionItem
          key={title}
          color={color}
          title={title}
          description={description}
          Icon={Icon}
          action={action}
        />
      ))}
    </section>
  );
};
