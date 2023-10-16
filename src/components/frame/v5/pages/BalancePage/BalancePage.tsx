import React, { FC } from 'react';

import { useColonyContext } from '~hooks';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';
// import Table from '../VerifiedPage/partials/Table';
import TableWithMeatballMenu from '~v5/common/TableWithMeatballMenu';
import { BalanceTableModel } from './types';
import { useGetTableMenuProps, useBalanceTableColumns } from './hooks';
// import BalaceTable from './partials/BalanceTable';
// import TableHead from './partials/TableHead';
import Button from '~v5/shared/Button';
import Filter from '~v5/common/Filter';

const displayName = 'frame.Extensions.pages.BalancePage';

const BalancePage: FC = () => {
  const { colony } = useColonyContext();
  const data: BalanceTableModel[] = colony?.balances?.items?.map((item) => ({
    key: item?.id,
    asset: item?.token?.name,
    symbol: item?.token?.symbol,
    type: item?.token?.type,
    balance: item?.balance,
    decimals: item?.token.decimals,
  }));
  const columns = useBalanceTableColumns();
  const getMenuProps = useGetTableMenuProps();
  const onAddFunds = () => {}; // @TODO: open modal

  console.log(colony?.balances?.items);

  return (
    <Spinner loading={false} loadingText={{ id: 'loading.advancedPage' }}>
      <TwoColumns aside={<Navigation pageName="members" />}>
        <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
          <div className="flex items-center">
            <h4 className="heading-5 mr-3">Colony token balance</h4>
          </div>
          <div className="flex items-center mt-2.5 sm:mt-0">
            {/* {!!selectedMembers.length && (
              <Button
                mode="quaternary"
                iconName="trash"
                size="small"
                className="mr-2"
              >
                {formatMessage({ id: 'button.removeMembers' })}
              </Button>
            )} */}
            {/* {!!data && <Filter />} */}
            <Button
              mode="primarySolid"
              className="ml-2"
              onClick={onAddFunds}
              size="small"
            >
              Add funds to the Colony
            </Button>
          </div>
        </div>
        <TableWithMeatballMenu<BalanceTableModel>
          className="mb-6"
          getRowId={({ key }) => key}
          columns={columns}
          data={data}
          getMenuProps={getMenuProps}
        />
        {/* <div className="flex justify-between mt-6">
          <div className="w-full">
            <BalaceTable data={data} onReputationSortClick={() => {}} getMenuProps={getMenuProps} />
          </div>
        </div> */}
      </TwoColumns>
    </Spinner>
  );
};

BalancePage.displayName = displayName;

export default BalancePage;
