import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Filter from '~v5/common/Filter';
import Button from '~v5/shared/Button';
// import { TableProps } from './types';
import styles from '../../VerifiedPage/partials/Table/Table.module.css';
import EmptyContent from '~v5/common/EmptyContent';
import { useSearchContext } from '~context/SearchContext';
// import { useVerifiedTable } from './hooks';
import TableHead from './TableHead';
import TableItem from './TableItem';

const displayName = 'v5.pages.VerifiedPage.partials.BalaceTable';

const BalaceTable: FC = ({ data, onReputationSortClick, getMenuProps }) => {
  // @TODO: Add action for adding new member, removing user from whitelist, handle pagination and sorting

  //   const { searchValue } = useSearchContext();
  //   const { onChange, selectedMembers } = useVerifiedTable();
  const onAddFunds = () => {}; // @TODO: open modal

  return (
    <>
      <div className="py-5 px-4 border border-gray-200 rounded-t-lg">
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
            {/* {(!!listLength || !!searchValue) && <Filter />} */}
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
      </div>
      <TableHead onClick={onReputationSortClick} />
      <div className={styles.tableBody}>
        {data.map((item) => (
          <TableItem
            key={item.contributorAddress}
            item={item}
            onDeleteClick={() => {}}
            onChange={(e) => {}}
            getMenuProps={getMenuProps}
          />
        ))}
      </div>
    </>
  );
};

BalaceTable.displayName = displayName;

export default BalaceTable;
