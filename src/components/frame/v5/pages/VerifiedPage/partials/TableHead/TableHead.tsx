import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';
import styles from '../Table/Table.module.css';
import { TableHeadProps } from './types';

const displayName = 'v5.pages.VerifiedPage.partials.TableHead';

const TableHead: FC<TableHeadProps> = ({ onClick }) => {
  const { formatMessage } = useIntl();

  return (
    <div className={styles.tableHead}>
      <div>{formatMessage({ id: 'verifiedPage.table.member' })}</div>
      <div className="hidden sm:block">
        {formatMessage({ id: 'verifiedPage.table.status' })}
      </div>
      <button
        className="hidden sm:flex items-center"
        type="button"
        aria-label={formatMessage({ id: 'ariaLabel.sortReputation' })}
        onClick={onClick}
      >
        <span className="mr-1">
          {formatMessage({ id: 'verifiedPage.table.reputation' })}
        </span>
        <Icon name="arrow-down" appearance={{ size: 'extraTiny' }} />
      </button>
      <button
        className="hidden sm:flex items-center"
        type="button"
        aria-label={formatMessage({ id: 'ariaLabel.sortPermission' })}
        onClick={onClick}
      >
        <span className="mr-1">
          {formatMessage({ id: 'verifiedPage.table.permission' })}
        </span>
        <Icon name="arrow-down" appearance={{ size: 'extraTiny' }} />
      </button>
      <div />
    </div>
  );
};

TableHead.displayName = displayName;

export default TableHead;
