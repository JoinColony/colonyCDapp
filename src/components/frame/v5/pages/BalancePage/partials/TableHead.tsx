import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Icon from '~shared/Icon';
import styles from '../../VerifiedPage/partials/Table/Table.module.css';
import { TableHeadProps } from './types';

const displayName = 'v5.pages.VerifiedPage.partials.TableHead';

const TableHead: FC<TableHeadProps> = ({ onClick }) => {
  const { formatMessage } = useIntl();

  return (
    <div className={styles.tableHead}>
      <div>Asset</div>
      <div className="hidden sm:block">
        Symbol
      </div>
      <div className="hidden sm:block">
        Type
      </div>
      <button
        className="hidden sm:flex items-center"
        type="button"
        aria-label={formatMessage({ id: 'ariaLabel.sortPermission' })}
        onClick={onClick}
      >
        <span className="mr-1">
          Balance
        </span>
        <Icon name="arrow-down" appearance={{ size: 'extraTiny' }} />
      </button>
      <div />
    </div>
  );
};

TableHead.displayName = displayName;

export default TableHead;
