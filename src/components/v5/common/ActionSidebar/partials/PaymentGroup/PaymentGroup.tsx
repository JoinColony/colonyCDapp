import React from 'react';

import { formatText } from '~utils/intl.ts';

import GroupedAction from '../GroupedAction/index.ts';
import GroupedActionWrapper from '../GroupedActionWrapper/index.ts';

import { useGetGroupList } from './useGetGroupList.tsx';

const PaymentGroup = () => {
  const groupList = useGetGroupList();
  return (
    <GroupedActionWrapper
      title={formatText({ id: 'actions.payments' })}
      description={formatText({ id: 'actions.description.payments' })}
    >
      <GroupedAction.List>
        {groupList.map(
          ({ Icon, title, description, action, isNew, isHidden }) => {
            return !isHidden ? (
              <GroupedAction.Item
                color="blue"
                Icon={Icon}
                title={title}
                description={description}
                action={action}
                key={`group-action-item-${action}`}
                isNew={isNew}
              />
            ) : null;
          },
        )}
      </GroupedAction.List>
    </GroupedActionWrapper>
  );
};
export default PaymentGroup;
