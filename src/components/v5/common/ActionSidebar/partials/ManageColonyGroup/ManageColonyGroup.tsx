import React from 'react';

import { formatText } from '~utils/intl.ts';

import GroupedAction from '../GroupedAction/index.ts';
import { type GroupListItem, type ThemeColor } from '../GroupedAction/types.ts';
import GroupedActionWrapper from '../GroupedActionWrapper/index.ts';

import {
  useGetGroupFundsList,
  useGetGroupTeamsList,
  useGetGroupAdminList,
} from './useGetGroupList.ts';

const ManageColonyGroup = () => {
  const groupFundsList = useGetGroupFundsList();
  const groupTeamsList = useGetGroupTeamsList();
  const groupAdminList = useGetGroupAdminList();

  const renderActionItems = (items: GroupListItem[], color: ThemeColor) => {
    return items.map(
      ({ Icon, title, description, action, isNew, isHidden }) => {
        return !isHidden ? (
          <GroupedAction.Item
            color={color}
            Icon={Icon}
            title={title}
            description={description}
            action={action}
            key={`group-action-item-${action}`}
            isNew={isNew}
          />
        ) : null;
      },
    );
  };

  return (
    <GroupedActionWrapper
      title={formatText({ id: 'actions.manageColony' })}
      description={formatText({ id: 'actions.description.manageColony' })}
    >
      <GroupedAction.List title={formatText({ id: 'actions.funds' })}>
        {renderActionItems(groupFundsList, 'purple')}
      </GroupedAction.List>
      <GroupedAction.List title={formatText({ id: 'actions.teams' })}>
        {renderActionItems(groupTeamsList, 'success')}
      </GroupedAction.List>
      <GroupedAction.List title={formatText({ id: 'actions.admin' })}>
        {renderActionItems(groupAdminList, 'warning')}
      </GroupedAction.List>
    </GroupedActionWrapper>
  );
};
export default ManageColonyGroup;
