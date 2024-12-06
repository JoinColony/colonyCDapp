import { Binoculars } from '@phosphor-icons/react';
import {
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import React, { type FC } from 'react';

import { IncomingFundsLoadingContextProvider } from '~frame/v5/pages/FundsPage/context/IncomingFundsLoadingContextProvider.tsx';
import { useMobile } from '~hooks';
import useColonyFundsClaims from '~hooks/useColonyFundsClaims.ts';
import { formatText } from '~utils/intl.ts';
import EmptyContent from '~v5/common/EmptyContent/index.ts';
import Table from '~v5/common/Table/index.ts';
import TableHeader from '~v5/common/TableHeader/TableHeader.tsx';
import CloseButton from '~v5/shared/Button/CloseButton.tsx';

import Filter from '../Filter/index.ts';

import { useFundsTable, useFundsTableColumns } from './hooks.tsx';
import { type FundsTableModel } from './types.ts';

const displayName = 'pages.FundsPage.partials.FundsTable';

const FundsTable: FC = () => {
  const columns = useFundsTableColumns();
  const isMobile = useMobile();
  const { filters, searchedTokens, activeFilters } = useFundsTable();
  const claims = useColonyFundsClaims();
  const unclaimedClaims = claims.filter((claim) => !claim.isClaimed);
  const allUnclaimedClaims = Array.from(
    new Set(unclaimedClaims.map((claim) => claim.token?.tokenAddress || '')),
  );

  return (
    <IncomingFundsLoadingContextProvider>
      <TableHeader title={formatText({ id: 'incomingFundsPage.table.title' })}>
        <div className="flex items-center gap-2">
          {!isMobile &&
            activeFilters.map((activeFilter) =>
              activeFilter ? (
                <div
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-blue-400"
                  key={activeFilter.filterName}
                >
                  <div className="container text-sm font-semibold capitalize">
                    {activeFilter.filterName}:
                  </div>
                  {activeFilter.filters.map((filter, index) => (
                    <p className="min-w-fit text-sm" key={filter?.toString()}>
                      {filter}
                      {index < activeFilter.filters.length - 1 && ','}
                    </p>
                  ))}
                  <CloseButton
                    iconSize={12}
                    aria-label={formatText({ id: 'ariaLabel.closeFilter' })}
                    className="ml-1 shrink-0 !p-0 text-current"
                    onClick={() => {
                      const filterToRemove = filters.items.find(
                        (item) => item.filterName === activeFilter.filterName,
                      )?.name;

                      if (filterToRemove) {
                        const updatedFilters = { ...filters.value };

                        delete updatedFilters[filterToRemove];

                        filters.onChange(updatedFilters);
                      }
                    }}
                  />
                </div>
              ) : null,
            )}
          <Filter
            {...filters}
            unclaimedClaims={allUnclaimedClaims}
            isButtonDisabled={!searchedTokens.length}
            shouldShowButton={unclaimedClaims.length > 0}
          />
        </div>
      </TableHeader>
      <Table<FundsTableModel>
        data={searchedTokens}
        columns={columns}
        initialState={{
          pagination: {
            pageSize: 10,
          },
        }}
        getFilteredRowModel={getFilteredRowModel()}
        getPaginationRowModel={getPaginationRowModel()}
        className="w-full [&_td>div]:p-0 [&_td]:border-b [&_td]:border-gray-100 [&_th:empty]:border-none [&_th:last-child]:text-right [&_tr:last-child>td]:border-0"
        emptyContent={
          (!searchedTokens.length || claims.length <= 0) && (
            <div className="w-full rounded-lg">
              <EmptyContent
                title={{ id: 'incomingFundsPage.table.emptyTitle' }}
                description={{ id: 'incomingFundsPage.table.emptyDescription' }}
                icon={Binoculars}
                className="py-[4.25rem]"
              />
            </div>
          )
        }
      />
    </IncomingFundsLoadingContextProvider>
  );
};

FundsTable.displayName = displayName;

export default FundsTable;
