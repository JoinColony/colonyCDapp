import React, { FC, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { useDetectClickOutside } from '~hooks';

import useToggle from '~hooks/useToggle';
import UserSelect from '../UserSelect';
import AmountField from '../AmountField';
import Icon from '~shared/Icon';
import Card from '~v5/shared/Card';
import styles from './TransactionItem.module.css';
import { TransactionItemProps } from './types';

const TransactionItem: FC<TransactionItemProps> = ({
  amount,
  token,
  id,
  recipent,
  onRemoveClick,
  onDuplicateClick,
  onUpdate,
}) => {
  const { formatMessage } = useIntl();
  const { watch } = useFormContext();
  const [
    isTransactionMenuVisible,
    { toggle: toggleTransactionMenu, toggleOff: toggleOffTransactionMenu },
  ] = useToggle();
  const ref = useDetectClickOutside({
    onTriggered: () => toggleOffTransactionMenu(),
  });

  const amountField = watch(`transaction-amount-${id}`);
  const recipentField = watch(`transaction-recipent-${id}`);

  useEffect(() => {
    if (!amountField && !recipentField) return;
    onUpdate(id, {
      amount: amountField,
      recipent: recipentField,
      token,
      key: id,
    });
  }, [amountField, recipentField]);

  return (
    <div className="flex items-center py-3 px-4 border-b border-gray-200 last:border-b-0 relative">
      <div className="w-1/3">
        <UserSelect
          name={`transaction-recipent-${id}`}
          selectedWalletAddress={recipent}
        />
      </div>
      <div className="w-2/3">
        <AmountField
          name={`transaction-amount-${id}`}
          amount={amount}
          defaultToken={token}
        />
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          type="button"
          className={styles.dotsButton}
          aria-label={formatMessage({ id: 'ariaLabel.openMenu' })}
          onClick={toggleTransactionMenu}
        >
          <Icon name="dots-three" appearance={{ size: 'extraTiny' }} />
        </button>
      </div>
      {isTransactionMenuVisible && (
        <Card
          className="p-6 w-full sm:max-w-[11.125rem] absolute top-[calc(100%-1rem)] right-3 z-50"
          hasShadow
          rounded="s"
          ref={ref}
        >
          <ul>
            <li className="mb-4 last:mb-0">
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => {
                  onRemoveClick(id);
                  toggleOffTransactionMenu();
                }}
              >
                <span className="text-gray-900 flex items-center gap-2">
                  <Icon name="trash" appearance={{ size: 'tiny' }} />
                  {formatMessage({ id: 'button.remove.row' })}
                </span>
              </button>
            </li>
            <li className="mb-4 last:mb-0">
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => {
                  onDuplicateClick(id);
                  toggleOffTransactionMenu();
                }}
              >
                <span className="text-gray-900 flex items-center gap-2">
                  <Icon name="copy-simple" appearance={{ size: 'tiny' }} />
                  {formatMessage({ id: 'button.duplicate.row' })}
                </span>
              </button>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default TransactionItem;
