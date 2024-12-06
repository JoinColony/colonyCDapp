import React from 'react';

import { formatText } from '~utils/intl.ts';

import GroupedAction from '../GroupedAction/index.ts';
import GroupedActionWrapper from '../GroupedActionWrapper/index.ts';

import {
  useGetGroupAdminList,
  useGetGroupFundsList,
  useGetGroupTeamsList,
} from './useGetGroupList.tsx';

const ManageColonyGroup = () => {
  const groupFundsList = useGetGroupFundsList();
  const groupTeamsList = useGetGroupTeamsList();
  const groupAdminList = useGetGroupAdminList();

  return (
    <GroupedActionWrapper
      title={formatText({ id: 'actions.manageColony' })}
      description={formatText({ id: 'actions.description.manageColony' })}
    >
      <GroupedAction.List title={formatText({ id: 'actions.funds' })}>
        {groupFundsList.map(
          ({ Icon, title, description, action, isNew, isHidden }) => {
            return !isHidden ? (
              <GroupedAction.Item
                color="purple"
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
      <GroupedAction.List title={formatText({ id: 'actions.teams' })}>
        {groupTeamsList.map(
          ({ Icon, title, description, action, isNew, isHidden }) => {
            return !isHidden ? (
              <GroupedAction.Item
                color="success"
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
      <GroupedAction.List title={formatText({ id: 'actions.admin' })}>
        {groupAdminList.map(
          ({ Icon, title, description, action, isNew, isHidden }) => {
            return !isHidden ? (
              <GroupedAction.Item
                color="warning"
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
export default ManageColonyGroup;
