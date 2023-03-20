import React from 'react';
import { nanoid } from 'nanoid';

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
      {detailItems.map(({ label, labelValues, item }) => (
        <DetailItem
          label={label}
          labelValues={labelValues}
          item={item}
          key={nanoid()}
        />
      ))}
    </div>
  );
};

DetailsWidget.displayName = displayName;

export default DetailsWidget;
