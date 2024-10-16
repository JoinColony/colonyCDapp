import { Binoculars } from '@phosphor-icons/react';
import { isEqual } from 'lodash';
import React, { type FC } from 'react';

import { CoreAction } from '~actions';
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
  const { show } = useActionSidebarContext();
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
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-gray-900 heading-4">
          {formatText({ id: 'teamsPage.allTeams' })}
        </h2>
        <div className="flex items-center gap-2 sm:ml-auto sm:justify-end">
          {hasFilterChanged &&
            !isEqual(defaultFilterValue, filters.filterValue) &&
            !isMobile && (
              <div className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-blue-400">
                <div className="container text-sm font-semibold capitalize">
                  {currentFilters.label}:
                </div>
                <p className="min-w-fit text-sm">{currentFilters.direction}</p>
                <CloseButton
                  iconSize={12}
                  aria-label={formatText({ id: 'ariaLabel.closeFilter' })}
                  className="ml-1 shrink-0 !p-0 text-current"
                  onClick={() => {
                    filters.onChange(defaultFilterValue);
                  }}
                />
              </div>
            )}
          <TeamsPageFilter {...filters} />
          <Button
            onClick={() =>
              show({
                [ACTION_TYPE_FIELD_NAME]: CoreAction.CreateDomain,
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
