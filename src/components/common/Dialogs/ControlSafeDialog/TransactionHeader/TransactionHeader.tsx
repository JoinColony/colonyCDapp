import classnames from 'classnames';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { UseFieldArrayRemove, useFormContext } from 'react-hook-form';
import { nanoid } from 'nanoid';

import Button from '~shared/Button';
import Heading from '~shared/Heading';
import Icon from '~shared/Icon';
import IconTooltip from '~shared/IconTooltip';

import { transactionOptions } from '../helpers';

import styles from './TransactionHeader.css';

const displayName =
  'common.ControlSafeDialog.ControlSafeForm.TransactionHeader';

const MSG = defineMessages({
  transactionTitle: {
    id: `${displayName}.transactionTitle`,
    defaultMessage: `Transaction #{transactionNumber} {transactionType, select, undefined {} other {({transactionType})}}`,
  },
  toggleTransaction: {
    id: `${displayName}.toggleTransaction`,
    defaultMessage:
      '{tabToggleStatus, select, true {Expand} other {Close}} transaction',
  },
  deleteTransactionTooltipText: {
    id: `${displayName}.deleteTransactionTooltipText`,
    defaultMessage: `Delete transaction.\nBe careful, data can be lost.`,
  },
});

interface Props {
  transactionIndex: number;
  transactionTabStatus: boolean[];
  handleTransactionTabStatus: React.Dispatch<React.SetStateAction<boolean[]>>;
  removeTab: UseFieldArrayRemove;
}

const TransactionHeader = ({
  transactionIndex,
  transactionTabStatus,
  handleTransactionTabStatus,
  removeTab,
}: Props) => {
  const { watch, trigger } = useFormContext();
  const transactions = watch('transactions');

  const handleTabRemoval = () =>
    // contractMethods?: UpdatedMethods,
    {
      removeTab(transactionIndex);

      // const shiftedContractMethods = contractMethods
      //   ? Object.keys(contractMethods).reduce((acc, contractMethodIndex) => {
      //       if (transactionIndex < Number(contractMethodIndex)) {
      //         return {
      //           ...acc,
      //           [Number(contractMethodIndex) - 1]: contractMethods[
      //             contractMethodIndex
      //           ],
      //         };
      //       }
      //       return {
      //         ...acc,
      //         [contractMethodIndex]: contractMethods[contractMethodIndex],
      //       };
      //     }, {})
      //   : {};
      // handleSelectedContractMethods(shiftedContractMethods, transactionIndex);

      const newTransactionTabStatus = [...transactionTabStatus];
      newTransactionTabStatus.splice(transactionIndex, 1);
      handleTransactionTabStatus(newTransactionTabStatus);
      trigger();
    };

  const handleTabToggle = (newIndex: number) => {
    const newTransactionTabs = transactionTabStatus.map((tab, index) =>
      index === newIndex ? !tab : tab,
    );
    handleTransactionTabStatus(newTransactionTabs);
  };

  const getTransactionTypeLabel = (transactionTypeValue: string) => {
    const selectedTransactionType = transactionOptions.find(
      (transaction) => transaction.value === transactionTypeValue,
    );
    return selectedTransactionType ? (
      <FormattedMessage {...selectedTransactionType.label} key={nanoid()} />
    ) : null;
  };

  return (
    <div
      className={classnames(styles.transactionHeading, {
        [styles.transactionHeadingOpen]: transactionTabStatus[transactionIndex],
      })}
    >
      <Heading
        appearance={{
          size: 'normal',
          margin: 'none',
          theme: 'dark',
        }}
        text={MSG.transactionTitle}
        textValues={{
          transactionNumber: transactionIndex + 1,
          transactionType: getTransactionTypeLabel(
            transactions[transactionIndex]?.transactionType || '',
          ),
        }}
      />
      <Button className={styles.tabButton} onClick={() => handleTabRemoval()}>
        <IconTooltip
          icon="trash"
          className={styles.deleteTabIcon}
          tooltipClassName={styles.deleteTabTooltip}
          tooltipText={MSG.deleteTransactionTooltipText}
        />
      </Button>
      <Button
        className={styles.tabButton}
        onClick={() => handleTabToggle(transactionIndex)}
      >
        <Icon
          name="caret-up"
          className={styles.toggleTabIcon}
          title={MSG.toggleTransaction}
          titleValues={{
            tabToggleStatus: transactionTabStatus[transactionIndex],
          }}
        />
      </Button>
    </div>
  );
};

export default TransactionHeader;
