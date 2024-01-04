import { nanoid } from 'nanoid';
import React from 'react';

import { Colony, ColonyAction } from '~types';

import DetailItem from './DetailItem';
import getDetailItems from './detailsWidgetConfig';

const displayName = 'DetailsWidget';

interface Props {
  colony: Colony;
  actionData: ColonyAction;
}

const DetailsWidget = ({ colony, actionData }: Props) => {
  const detailItems = getDetailItems(actionData, colony);
  return (
    <div>
      {detailItems.map(({ label, labelValues, item }) => {
        // If no label assume the item is self contained
        // for example the Safe Transaction item
        if (!label) {
          return item;
        }

        return (
          <DetailItem
            label={label}
            labelValues={labelValues}
            item={item}
            key={nanoid()}
          />
        );
      })}
    </div>
  );
};

DetailsWidget.displayName = displayName;

export default DetailsWidget;
