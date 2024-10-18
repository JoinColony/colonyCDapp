import React from 'react';

import { formatText } from '~utils/intl.ts';

import GroupedAction from '../GroupedAction/index.ts';
import GroupedActionWrapper from '../GroupedActionWrapper/index.ts';

import { GROUP_LIST } from './GroupList.ts';

const PaymentGroup = () => {
  return (
    <GroupedActionWrapper
      title={formatText({ id: 'actions.payments' })}
      description={formatText({ id: 'actions.description.payments' })}
    >
      <GroupedAction.List>
        {GROUP_LIST.map(({ Icon, title, description, action }) => {
          return (
            <GroupedAction.Item
              color="blue"
              Icon={Icon}
              title={title}
              description={description}
              action={action}
              key={`group-action-item-${action}`}
            />
          );
        })}
      </GroupedAction.List>
    </GroupedActionWrapper>
  );
};
export default PaymentGroup;
