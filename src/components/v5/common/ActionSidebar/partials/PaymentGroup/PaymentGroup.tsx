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
      {/* FIXME: I don't know what this does but it needs to come back (was in: ActionSidebar)  */}
      {/* I assume it's a button to go back when there was a group??? */}
      {/* {actionGroupType && ( */}
      {/*   <GoBackButton */}
      {/*     action={action} */}
      {/*     onClick={transactionId ? closeSidebarClick : undefined} */}
      {/*   /> */}
      {/* )} */}
    </GroupedActionWrapper>
  );
};
export default PaymentGroup;
