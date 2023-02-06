import React from 'react';
import { nanoid } from 'nanoid';

import { Colony, ColonyAction } from '~types';
import { mockEventData } from '~common/ColonyActions/mockData';

import DetailItem from './DetailItem';
import getDetailItems from './detailsWidgetConfig';

const displayName = 'DetailsWidget';

interface Props {
  colony: Colony;
  values: typeof mockEventData & ColonyAction;
}

const DetailsWidget = ({ colony, values }: Props) => {
  const detailItems = getDetailItems(values, colony);

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
