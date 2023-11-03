import { BigNumber } from 'ethers';
import React, { FC } from 'react';
import { useColonyContext, useColonyFundsClaims } from '~hooks';
import useToggle from '~hooks/useToggle';
import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';
import Table from '~v5/common/Table';
import AccordionItem from '~v5/shared/Accordion/partials/AccordionItem';
import { useTokenTableColumns } from './hooks';

import { TokenTableProps } from './types';

const TokenTable: FC<TokenTableProps> = ({ token }) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};
  const claims = useColonyFundsClaims();
  const currentClaims = claims.filter(
    ({ token: currentClaimToken }) => currentClaimToken?.name === token.name,
  );
  const claimsAmount = currentClaims.reduce(
    (acc, { amount }) => acc.add(amount),
    BigNumber.from(0),
  );
  const [isTableRowOpen, { toggle: toggleTableRowAccordion }] = useToggle();
  const columns = useTokenTableColumns();

  return (
    <AccordionItem
      className="text-1 text-gray-900 w-full px-[1.125rem]"
      isOpen={isTableRowOpen}
      onToggle={toggleTableRowAccordion}
      iconName="chevron-down"
      title={
        <div className="flex items-center justify-between w-full py-4">
          <div className="flex items-center gap-4">
            <TokenIcon token={token} size="xs" />
            {token?.symbol}
          </div>
          <div>
            <Numeral
              value={claimsAmount || 0}
              decimals={nativeToken?.decimals}
            />{' '}
            {token?.symbol}
          </div>
        </div>
      }
    >
      {currentClaims.length > 0 && (
        <Table
          data={currentClaims}
          verticalOnMobile={false}
          columns={columns}
          className="border-0 rounded-none -mx-[1.125rem] w-[calc(100%+2.25rem)] [&_td]:px-[1.125rem] [&_td]:py-4"
        />
      )}
    </AccordionItem>
  );
};

export default TokenTable;
