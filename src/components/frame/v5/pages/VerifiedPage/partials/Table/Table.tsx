import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Filter from '~v5/common/Filter';
import Button from '~v5/shared/Button';
import { TableProps } from './types';
import styles from './Table.module.css';
import TableItem from '../TableItem';
import TableHead from '../TableHead';
import EmptyContent from '~v5/common/EmptyContent';
import { useSearchContext } from '~context/SearchContext';
import { useVerifiedTable } from './hooks';

const displayName = 'v5.pages.VerifiedPage.partials.Table';

const Table: FC<TableProps> = ({
  list,
  onReputationSortClick,
  isSortedDesc,
}) => {
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
            {!!selectedMembers.length && (
              <Button
                mode="quaternary"
                iconName="trash"
                size="small"
                className="mr-2"
              >
                {formatMessage({ id: 'button.removeMembers' })}
              </Button>
            )}
            {(!!listLength || !!searchValue) && <Filter />}
            <Button
              mode="primarySolid"
              className="ml-2"
              onClick={onAddClick}
              size="small"
            >
              {formatMessage({ id: 'button.addNewMember' })}
            </Button>
          </div>
        </div>
      </div>
      <TableHead onClick={onReputationSortClick} isSortedDesc={isSortedDesc} />
      <div className={styles.tableBody}>
        {listLength ? (
          list.map((item) => (
            <TableItem
              key={item.contributorAddress}
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
            buttonText={{ id: 'button.addNewMember' }}
            onClick={onAddClick}
            withoutButtonIcon
          />
        )}
      </div>
    </>
  );
};

Table.displayName = displayName;

export default Table;
