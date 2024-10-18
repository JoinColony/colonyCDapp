import React from 'react';

import { formatText } from '~utils/intl.ts';

import GroupedAction from '../GroupedAction/index.ts';
import GroupedActionWrapper from '../GroupedActionWrapper/index.ts';

import {
  GROUP_FUNDS_LIST,
  GROUP_TEAMS_LIST,
  GROUP_ADMIN_LIST,
} from './GroupList.ts';

const ManageColonyGroup = () => {
  return (
    <GroupedActionWrapper
      title={formatText({ id: 'actions.manageColony' })}
      description={formatText({ id: 'actions.description.manageColony' })}
    >
      <GroupedAction.List title={formatText({ id: 'actions.funds' })}>
        {GROUP_FUNDS_LIST.map(({ Icon, title, description, action }) => {
          return (
            <GroupedAction.Item
              color="purple"
              Icon={Icon}
              title={title}
              description={description}
              action={action}
              key={`group-action-item-${action}`}
            />
          );
        })}
      </GroupedAction.List>
      <GroupedAction.List title={formatText({ id: 'actions.teams' })}>
        {GROUP_TEAMS_LIST.map(({ Icon, title, description, action }) => {
          return (
            <GroupedAction.Item
              color="success"
              Icon={Icon}
              title={title}
              description={description}
              action={action}
              key={`group-action-item-${action}`}
            />
          );
        })}
      </GroupedAction.List>
      <GroupedAction.List title={formatText({ id: 'actions.admin' })}>
        {GROUP_ADMIN_LIST.map(({ Icon, title, description, action }) => {
          return (
            <GroupedAction.Item
              color="warning"
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
export default ManageColonyGroup;
