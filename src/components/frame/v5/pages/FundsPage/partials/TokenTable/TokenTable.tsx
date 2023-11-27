import React, { FC, useState } from 'react';
import { BigNumber } from 'ethers';

import { getSortedRowModel, SortingState } from '@tanstack/react-table';
import { useColonyContext, useColonyFundsClaims } from '~hooks';
import useToggle from '~hooks/useToggle';
import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';
import Table from '~v5/common/Table';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem';

import { useTokenTableColumns } from './hooks';
import { TokenTableProps } from './types';

const displayName = 'v5.pages.FundsPage.partials.TokenTable';

const TokenTable: FC<TokenTableProps> = ({ token }) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
  const claims = useColonyFundsClaims();
  const currentClaims = claims.filter(
    ({ token: currentClaimToken }) => currentClaimToken?.name === token?.name,
  );
  const claimsAmount =
    currentClaims.reduce(
      (acc, { amount }) => acc.add(amount),
      BigNumber.from(0),
    ) || 0;
  const [isTableRowOpen, { toggle: toggleTableRowAccordion }] = useToggle();
  const columns = useTokenTableColumns();
  const [sorting, setSorting] = useState<SortingState>([]);

  return claimsAmount.gt(0) && token ? (
    <AccordionItem
      className="text-1 text-gray-900 w-full [&_.accordion-toggler]:px-[1.125rem] sm:hover:[&_.accordion-toggler]:bg-gray-25"
      isOpen={isTableRowOpen}
      onToggle={toggleTableRowAccordion}
      iconName="chevron-down"
      title={
        <div className="flex items-center justify-between w-full py-4 text-gray-900">
          <div className="flex items-center gap-4">
            <TokenIcon token={token} size="xs" />
            {token?.name}
          </div>
          <div>
            <Numeral value={claimsAmount} decimals={nativeToken?.decimals} />{' '}
            {token?.symbol}
          </div>
        </div>
      }
    >
      <Table
        data={currentClaims}
        state={{ sorting }}
        onSortingChange={setSorting}
        getSortedRowModel={getSortedRowModel()}
        verticalOnMobile={false}
        columns={columns}
        className="border-0 rounded-none -mx-[1.125rem] px-[1.125rem] !w-[calc(100%+2.25rem)] [&_td]:px-[1.125rem] [&_th]:border-y border-gray-200 [&_td]:py-4"
      />
    </AccordionItem>
  ) : null;
};

TokenTable.displayName = displayName;

export default TokenTable;
