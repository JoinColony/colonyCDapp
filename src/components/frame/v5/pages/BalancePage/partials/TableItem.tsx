import React, { FC, useCallback, useState } from 'react';
import MeatBallMenu from '~v5/shared/MeatBallMenu';
import styles from '../../VerifiedPage/partials/TableItem/TableItem.module.css';
import { formatText } from '~utils/intl';

const displayName = 'v5.pages.VerifiedPage.partials.TableItem';

const TableItem: FC = ({ item, onDeleteClick, onChange, getMenuProps }) => {
  const { asset, symbol, type, balance } = item || {};

  const handleChange = useCallback(
    (e) => {
      onChange(e);
    },
    [onChange],
  );

  return (
    <div className={styles.tableItem}>
      <div className="flex items-center">
        <div className="ml-1 flex">{asset}</div>
      </div>
      <div className="hidden sm:flex items-center">{symbol}</div>
      <div className="hidden sm:flex items-center">{type}</div>
      <div className="flex">
        <button
          type="button"
          className="ml-auto flex items-center hover:text-negative-400 transition-colors duration-normal"
          aria-label={formatText({ id: 'ariaLabel.deleteMember' })}
          onClick={onDeleteClick}
        >
          {balance}
        </button>
        <MeatBallMenu items={getMenuProps} />
      </div>
    </div>
  );
};

TableItem.displayName = displayName;

export default TableItem;
