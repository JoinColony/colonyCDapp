import classnames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import { SafeTransactionType } from '~gql';
import Button from '~shared/Button';
import Heading from '~shared/Heading';
import Icon from '~shared/Icon';

import { SafeTransactionMSG } from '../../helpers';

import styles from './TransactionPreviewHeader.css';

const displayName = `common.ControlSafeDialog.ControlSafeForm.SafeTransactionPreview.TransactionPreviewHeader`;

const MSG = defineMessages({
  transactionTitle: {
    id: `${displayName}.transactionTitle`,
    defaultMessage: `{transactionNumber}. {transactionType, select, undefined {} other {{transactionType}}}`,
  },
  toggleTransaction: {
    id: `${displayName}.toggleTransaction`,
    defaultMessage: `{tabToggleStatus, select, other {Expand} true {Close}} transaction`,
  },
});

interface Props {
  transactionIndex: number;
  transactionTabStatus: boolean[];
  handleTransactionTabStatusChange: React.Dispatch<
    React.SetStateAction<boolean[]>
  >;
}

const TransactionPreviewHeader = ({
  transactionIndex,
  handleTransactionTabStatusChange,
  transactionTabStatus,
}: Props) => {
  const { watch } = useFormContext();
  const transactionType: SafeTransactionType = watch(
    `transactions.${transactionIndex}.transactionType`,
  );
  const { formatMessage } = useIntl();

  const handleTabToggle = (newIndex: number) => {
    const newTransactionTabs = transactionTabStatus.map((tab, index) =>
      index === newIndex ? !tab : tab,
    );
    handleTransactionTabStatusChange([...newTransactionTabs]);
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
          transactionType: formatMessage(SafeTransactionMSG[transactionType]),
        }}
      />
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

TransactionPreviewHeader.displayName = displayName;

export default TransactionPreviewHeader;
