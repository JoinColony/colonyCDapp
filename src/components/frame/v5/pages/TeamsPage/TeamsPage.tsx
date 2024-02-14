import { Binoculars } from '@phosphor-icons/react';
import { isEqual } from 'lodash';
import React, { type FC } from 'react';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import { ModelSortDirection } from '~gql';
import { useMobile } from '~hooks';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import EmptyContent from '~v5/common/EmptyContent/EmptyContent.tsx';
import TeamCardList from '~v5/common/TeamCardList/index.ts';
import Button, { CloseButton } from '~v5/shared/Button/index.ts';

import { useTeams } from './hooks.tsx';
import TeamsPageFilter from './partials/TeamsPageFilter/TeamsPageFilter.tsx';

const TeamsPage: FC = () => {
  useSetPageHeadingTitle(formatText({ id: 'teamsPage.title' }));
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const { filters, searchedTeams, defaultFilterValue, hasFilterChanged } =
    useTeams();
  const isMobile = useMobile();
  const currentFilters = {
    direction:
      filters.filterValue.direction === ModelSortDirection.Desc
        ? formatText({ id: 'teamsPage.filter.descending' })
        : formatText({ id: 'teamsPage.filter.ascending' }),
    label: filters.items.find((item) => item.name === filters.filterValue.field)
      ?.filterName,
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="heading-4 text-gray-900">
          {formatText({ id: 'teamsPage.allTeams' })}
        </h2>
        <div className="sm:ml-auto flex sm:justify-end items-center gap-2">
          {hasFilterChanged &&
            !isEqual(defaultFilterValue, filters.filterValue) &&
            !isMobile && (
              <div className="bg-blue-100 py-2 px-3 rounded-lg inline-flex items-center gap-1 text-blue-400">
                <div className="text-sm font-semibold capitalize container">
                  {currentFilters.label}:
                </div>
                <p className="text-sm min-w-fit">{currentFilters.direction}</p>
                <CloseButton
                  iconSize={12}
                  aria-label={formatText({ id: 'ariaLabel.closeFilter' })}
                  className="shrink-0 text-current ml-1 !p-0"
                  onClick={() => {
                    filters.onChange(defaultFilterValue);
                  }}
                />
              </div>
            )}
          <TeamsPageFilter {...filters} />
          <Button
            onClick={() =>
              toggleActionSidebarOn({
                [ACTION_TYPE_FIELD_NAME]: Action.CreateNewTeam,
              })
            }
            text={formatText({ id: 'teamsPage.createNewTeam' })}
            mode="primarySolid"
            size="small"
          />
        </div>
      </div>
      {searchedTeams.length > 0 ? (
        <TeamCardList items={searchedTeams} />
      ) : (
        <EmptyContent
          className="pb-9 pt-10"
          title={formatText({ id: 'teamsPage.empty.title' })}
          description={formatText({ id: 'teamsPage.empty.description' })}
          icon={Binoculars}
          withBorder
        />
      )}
    </div>
  );
};

export default TeamsPage;
