import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Filter from '~v5/common/Filter';
import Button from '~v5/shared/Button';
import { TableProps } from './types';
import styles from './Table.module.css';
import TableItem from '../TableItem';
import EmptyContent from '~v5/common/EmptyContent';
import { useSearchContext } from '~context/SearchContext';
import { useVerifiedTable } from './hooks';
import Icon from '~shared/Icon';

const Table: FC<TableProps> = ({ list, onReputationSortClick }) => {
  // @TODO: Add action for adding new member, removing user from whitelist, handle pagination and sorting
  const { formatMessage } = useIntl();
  const { searchValue } = useSearchContext();
  const { onChange, selectedMembers } = useVerifiedTable();

  const onAddClick = () => {};

  const listLength = list.length;

  return (
    <>
      <div className="py-5 px-4 border border-gray-200 rounded-t-lg">
        <div className="flex sm:justify-between sm:items-center sm:flex-row flex-col">
          <div className="flex items-center">
            <h4 className="heading-5 mr-3">
              {formatMessage({ id: 'verifiedPage.membersTitle' })}
            </h4>
            <span className="text-md text-blue-400">
              {listLength} {formatMessage({ id: 'verifiedPage.members' })}
            </span>
          </div>
          <div className="flex items-center mt-2.5 sm:mt-0">
            {selectedMembers.length ? (
              <Button
                mode="secondaryOutline"
                iconName="trash"
                size="small"
                className="mr-2"
              >
                Remove members
              </Button>
            ) : undefined}
            {!listLength && !searchValue ? undefined : <Filter />}
            <Button
              mode="primarySolid"
              className="ml-2"
              onClick={onAddClick}
              size="small"
            >
              {formatMessage({ id: 'verifiedPage.table.button' })}
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.tableHead}>
        <div>{formatMessage({ id: 'verifiedPage.table.member' })}</div>
        <div className="hidden sm:block">
          {formatMessage({ id: 'verifiedPage.table.status' })}
        </div>
        <button
          className="hidden sm:flex items-center"
          type="button"
          onClick={onReputationSortClick}
        >
          <span className="mr-1">
            {formatMessage({ id: 'verifiedPage.table.reputation' })}
          </span>
          <Icon name="arrow-down" appearance={{ size: 'extraTiny' }} />
        </button>
        <button
          className="hidden sm:flex items-center"
          type="button"
          onClick={onReputationSortClick}
        >
          <span className="mr-1">
            {formatMessage({ id: 'verifiedPage.table.permission' })}
          </span>
          <Icon name="arrow-down" appearance={{ size: 'extraTiny' }} />
        </button>
        <div />
      </div>
      <div className={styles.tableBody}>
        {listLength ? (
          list.map((item) => (
            <TableItem
              key={item.address}
              member={item}
              onDeleteClick={() => {}}
              onChange={(e) => onChange(e, item)}
            />
          ))
        ) : (
          <EmptyContent
            icon="binoculars"
            title={{ id: 'verifiedPage.table.emptyTitle' }}
            description={{ id: 'verifiedPage.table.emptyDescription' }}
            buttonText={{ id: 'verifiedPage.table.button' }}
            onClick={onAddClick}
            withoutButtonIcon
          />
        )}
      </div>
    </>
  );
};

export default Table;
