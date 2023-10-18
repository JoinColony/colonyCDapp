import React, { FC } from 'react';
import Button from '~v5/shared/Button';
import TableHead from './TableHead';
import TableItem from './TableItem';
import { formatText } from '~utils/intl';
import { useColonyContext } from '~hooks';
import { BalaceTableProps } from '../types';

const displayName = 'v5.pages.BalancePage.partials.BalaceTable';

const BalaceTable: FC<BalaceTableProps> = ({
  data,
  isSorted,
  onBalanceSort,
}) => {
  const { colony } = useColonyContext();
  const { balances, nativeToken, status } = colony || {};
  const { nativeToken: nativeTokenStatus } = status || {};
  const onAddFunds = () => {}; // @TODO: open modal

  return (
    <>
      <div className="py-5 px-4 border border-gray-200 rounded-t-lg">
        <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
          <div className="flex items-center">
            <h4 className="heading-5 mr-3">
              {formatText({ id: 'balancePage.table.title' })}
            </h4>
          </div>
          <div className="flex items-center mt-2.5 sm:mt-0">
            <Button
              mode="primarySolid"
              className="ml-2"
              onClick={onAddFunds}
              size="small"
            >
              {formatText({ id: 'balancePage.table.addFunds' })}
            </Button>
          </div>
        </div>
      </div>
      <TableHead onClick={onBalanceSort} isSorted={isSorted} />
      {data && (
        <div className="px-4 border border-gray-200 rounded-b-lg">
          {data.map((item) => (
            <TableItem
              key={item?.token.tokenAddress}
              token={item?.token}
              isTokenNative={
                item?.token.tokenAddress === nativeToken?.tokenAddress
              }
              balances={balances || {}}
              nativeTokenStatus={nativeTokenStatus || {}}
            />
          ))}
        </div>
      )}
    </>
  );
};

BalaceTable.displayName = displayName;

export default BalaceTable;
