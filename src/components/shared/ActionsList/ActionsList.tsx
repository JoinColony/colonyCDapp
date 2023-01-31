import React, { ComponentType } from 'react';

import { ActionsListItem } from '~common/ColonyActions';

const displayName = 'ActionsList';

interface Props {
  handleItemClick?: () => void;
  items: any[]; // actions or events
  itemComponent?: ComponentType<{
    handleOnClick?: () => void;
    item: any;
    key: string;
  }>;
}

const ActionsList = ({
  items,
  handleItemClick,
  itemComponent: Item = ActionsListItem,
}: Props) => (
  <ul>
    {items.map((item) => (
      <Item key={item.id} item={item} handleOnClick={handleItemClick} />
    ))}
  </ul>
);

ActionsList.displayName = displayName;

export default ActionsList;
