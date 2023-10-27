import { getFilteredRowModel } from '@tanstack/react-table';
import React, { FC, useMemo, useState } from 'react';
import getTokenList from '~common/Dialogs/TokenManagementDialog/TokenManagementDialogForm/getTokenList';
import { useColonyContext } from '~hooks';
import { notNull } from '~utils/arrays';
import Table from '~v5/common/Table';
import Button from '~v5/shared/Button';
import { useFundsTableColumns } from './hooks';

const FundsTable: FC = () => {
  const { colony } = useColonyContext();
  const predefinedTokens = getTokenList();
  const colonyTokens = useMemo(
    () => colony?.tokens?.items.filter(notNull) || [],
    [colony?.tokens?.items],
  );
  const columns = useFundsTableColumns();
  const [notApprovedVisible, setNotApprovedVisible] = useState(false);

  const data = useMemo(() => {
    if (notApprovedVisible) {
      return [...colonyTokens, ...predefinedTokens];
    }
    return colonyTokens;
  }, [colonyTokens, predefinedTokens, notApprovedVisible]);

  return (
    <>
      <Button onClick={() => setNotApprovedVisible((prevState) => !prevState)}>
        ad
      </Button>
      <Table
        data={data}
        columns={columns}
        verticalOnMobile={false}
        getFilteredRowModel={getFilteredRowModel()}
        className="[&_td]:border-b [&_td]:border-gray-100 [&_tr:last-child>td]:border-0 [&_td]:p-0"
      />
    </>
  );
};

export default FundsTable;
