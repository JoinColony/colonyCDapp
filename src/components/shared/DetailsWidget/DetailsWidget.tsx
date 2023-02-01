import React from 'react';
import { nanoid } from 'nanoid';

import { Colony, ColonyActions, ColonyMotions, User } from '~types';
import { EventValues } from '~utils/colonyActions';

import DetailItem from './DetailItem';
import getDetailItems from './detailsWidgetConfig';

const displayName = 'DetailsWidget';

interface Props {
  actionType: ColonyActions | ColonyMotions;
  colony: Colony;
  transactionHash?: string;
  recipientAddress?: User['walletAddress'];
  values: EventValues;
}

const DetailsWidget = ({
  actionType,
  colony,
  transactionHash,
  values,
  recipientAddress,
}: Props) => {
  const detailItems = getDetailItems(
    actionType,
    values,
    colony,
    recipientAddress,
    transactionHash,
  );

  return (
    <div>
      {detailItems.map(
        ({ label, labelValues, item }) =>
          item && (
            <DetailItem
              label={label}
              labelValues={labelValues}
              item={item}
              key={nanoid()}
            />
          ),
      )}
    </div>
  );
};

DetailsWidget.displayName = displayName;

export default DetailsWidget;
