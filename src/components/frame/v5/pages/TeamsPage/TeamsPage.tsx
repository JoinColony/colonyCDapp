import React, { FC } from 'react';

import { ACTION } from '~constants/actions';
import { useActionSidebarContext, useSetPageHeadingTitle } from '~context';
import { formatText } from '~utils/intl';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import TeamCardList from '~v5/common/TeamCardList';
import Button from '~v5/shared/Button';

import { useTeams } from './hooks';

const TeamsPage: FC = () => {
  useSetPageHeadingTitle(formatText({ id: 'teamsPage.title' }));
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const teams = useTeams();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="heading-4 text-gray-900">
          {formatText({ id: 'teamsPage.allTeams' })}
        </h2>
        <div className="sm:ml-auto flex sm:justify-end items-center gap-2">
          {/* @todo: add All filters button here */}
          <Button
            onClick={() =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: ACTION.CREATE_NEW_TEAM,
              })
            }
            text={formatText({ id: 'teamsPage.createNewTeam' })}
            mode="primarySolid"
            size="small"
          />
        </div>
      </div>
      <TeamCardList items={teams} />
    </div>
  );
};

export default TeamsPage;
