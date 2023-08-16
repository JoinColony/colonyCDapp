import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import classnames from 'classnames';
import { nanoid } from 'nanoid';
import { useFormContext } from 'react-hook-form';

import { DialogSection } from '~shared/Dialog';
import { HookFormInput as Input, Annotations } from '~shared/Fields';
import DialogHeading from '~shared/Dialog/DialogHeading';
import Heading from '~shared/Heading';
import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';
import Button from '~shared/Button';
import Icon from '~shared/Icon';
import Avatar from '~shared/Avatar';
import { NFTData, Token, User } from '~types';
import { omit } from '~utils/lodash';
import {
  defaultTransaction,
  extractTokenName,
  TransactionTypes,
} from '~utils/safes';
import { formatArgument } from '~shared/DetailsWidget/SafeTransactionDetail/components/FunctionsSection';

import AddressDetailsView from './TransactionPreview/AddressDetailsView';
import { transactionOptions, MSG as ConstantsMSG } from './helpers';
import DetailsItem from './DetailsItem';
import { ControlSafeProps, SafeTransaction } from './types';

import styles from './SafeTransactionPreview.css';

const displayName = `common.ControlSafeDialog.ControlSafeForm.SafeTransactionPreview`;

const MSG = defineMessages({
  previewTitle: {
    id: `${displayName}.previewTitle`,
    defaultMessage: `Confirm transaction details`,
  },
  transactionsTitle: {
    id: `${displayName}.transactionsTitle`,
    defaultMessage: `Title`,
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `Description (optional)`,
  },
  safe: {
    id: `${displayName}.safe`,
    defaultMessage: `Safe`,
  },
  function: {
    id: `${displayName}.function`,
    defaultMessage: `Function`,
  },
  to: {
    id: `${displayName}.to`,
    defaultMessage: `To`,
  },
  amount: {
    id: `${displayName}.amount`,
    defaultMessage: `Amount`,
  },
  contract: {
    id: `${displayName}.contract`,
    defaultMessage: `Contract`,
  },
  abi: {
    id: `${displayName}.abi`,
    defaultMessage: `ABI`,
  },
  nft: {
    id: `${displayName}.nft`,
    defaultMessage: `NFT`,
  },
  transactionType: {
    id: `${displayName}.transactionType`,
    defaultMessage: `Transaction type`,
  },
  nftHeldByTheSafe: {
    id: `${displayName}.nftHeldByTheSafe`,
    defaultMessage: `NFT held by the safe`,
  },
  targetContract: {
    id: `${displayName}.targetContract`,
    defaultMessage: `Target contract`,
  },
  nftId: {
    id: `${displayName}.nftId`,
    defaultMessage: `Id`,
  },
  data: {
    id: `${displayName}.data`,
    defaultMessage: `Data`,
  },
  contractFunction: {
    id: `${displayName}.contractFunction`,
    defaultMessage: `Contract function`,
  },
  value: {
    id: `${displayName}.value`,
    defaultMessage: `Value (wei)`,
  },
  transactionTitle: {
    id: `${displayName}.transactionTitle`,
    defaultMessage: `{transactionNumber}. {transactionType, select, undefined {} other {{transactionType}}}`,
  },
  toggleTransaction: {
    id: `${displayName}.toggleTransaction`,
    defaultMessage: `{tabToggleStatus, select, other {Expand} true {Close}} transaction`,
  },
  contractMethodInputLabel: {
    id: `${displayName}.contractMethodInputLabel`,
    defaultMessage: `{name} ({type})`,
  },
});

const transactionTypeFieldsMap = {
  [TransactionTypes.TRANSFER_FUNDS]: [
    {
      key: 'amount',
      label: MSG.amount,
      value: (amount: string, token: Token) => (
        <div className={styles.tokenAmount}>
          <TokenIcon token={token} size="xxs" />
          <Numeral value={amount} suffix={token.symbol} />
        </div>
      ),
    },
  ],
  [TransactionTypes.TRANSFER_NFT]: [
    {
      key: 'transactionType',
      label: MSG.transactionType,
      value: () => <FormattedMessage {...ConstantsMSG.transferNft} />,
    },
    {
      key: 'nftData',
      label: MSG.nftHeldByTheSafe,
      value: (nftData: NFTData) => (
        <div className={styles.nftContainer}>
          <Avatar
            avatar={nftData.imageUri || ''}
            placeholderIcon="nft-icon"
            seed={nftData.address.toLocaleLowerCase()}
            title=""
            size="xs"
            className={styles.avatar}
          />
          <div className={styles.itemValue}>
            {extractTokenName(nftData.name || nftData.tokenName)}
          </div>
        </div>
      ),
    },
    {
      key: 'nftData',
      label: MSG.nftId,
      value: (nftData: NFTData) => (
        <div className={styles.itemValue}>{nftData.id}</div>
      ),
    },
    {
      key: 'recipient',
      label: MSG.to,
      value: (recipient: User) => (
        <AddressDetailsView item={recipient} isSafeItem={false} />
      ),
    },
  ],
  [TransactionTypes.CONTRACT_INTERACTION]: [
    {
      key: 'contract',
      label: MSG.contract,
      value: (contract) => (
        <div className={styles.rawTransactionValues}>
          <span className={styles.contractName}>
            {contract.profile.displayName}
          </span>
        </div>
      ),
    },
    {
      key: 'contractFunction',
      label: MSG.contractFunction,
      value: (contractFunction) => (
        <div className={styles.rawTransactionValues}>{contractFunction}</div>
      ),
    },
  ],
  [TransactionTypes.RAW_TRANSACTION]: [
    {
      key: 'rawAmount',
      label: MSG.value,
      value: (value) => (
        <div className={styles.rawTransactionValues}>{value}</div>
      ),
    },
    {
      key: 'data',
      label: MSG.data,
      value: (data) => (
        <div className={styles.rawTransactionValues}>{data}</div>
      ),
    },
  ],
};

interface Props
  extends Pick<ControlSafeProps, 'colony' | 'selectedContractMethods'> {
  isVotingExtensionEnabled: boolean;
  userHasPermission: boolean;
  disabledInput: boolean;
}

const SafeTransactionPreview = ({
  colony,
  selectedContractMethods,
  isVotingExtensionEnabled,
  userHasPermission,
  disabledInput,
}: Props) => {
  const { watch, setValue } = useFormContext();

  const safe = watch('safe');
  const transactions: SafeTransaction[] = watch(`transactions`);

  const [transactionTabStatus, setTransactionTabStatus] = useState(
    Array(transactions.length).fill(false),
  );
  const { formatMessage } = useIntl();

  const tokens = transactions.map((t) => t.token);

  const handleTabToggle = (newIndex: number) => {
    const newTransactionTabs = transactionTabStatus.map((tab, index) =>
      index === newIndex ? !tab : tab,
    );
    setTransactionTabStatus([...newTransactionTabs]);
  };

  const getTransactionTypeLabel = (transactionTypeValue: string) => {
    const transactionType = transactionOptions.find(
      (transaction) => transaction.value === transactionTypeValue,
    );
    return transactionType ? formatMessage(transactionType.label) : null;
  };

  const autogeneratedIds = [...new Array(transactions.length)].map(nanoid);

  const isNFT = (index: number) =>
    transactions[index].transactionType === TransactionTypes.TRANSFER_NFT;

  /*
   * Remove unused contract functions from form state.
   * Doing it here instead of in the Contract Interaction section so that the user doesn't lose state in the
   * event they switch between contract functions. We need this so the correct functions appear on the actions page.
   */
  useEffect(() => {
    transactions.forEach((transaction, index) => {
      const actualSelectedFunction = transaction.contractFunction;
      const allSelectedMethodKeys = Object.keys(
        omit(transaction, Object.keys(defaultTransaction)),
      );
      const keysToExclude = allSelectedMethodKeys.filter(
        // the keys end with "-[functionName]", so we exclude the ones that don't end in the
        // function name that the user ended up choosing
        (key) => !new RegExp(`-${actualSelectedFunction}$`).test(key),
      );
      const updatedTransaction = {
        ...omit(transaction, keysToExclude),
      };
      setValue(`transactions.${index}`, updatedTransaction);
    });
    // initialisation only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.previewTitle}
          userHasPermission={userHasPermission}
          isVotingExtensionEnabled={isVotingExtensionEnabled}
          isRootMotion
          colony={colony}
        />
      </DialogSection>
      {transactions.map((transaction, index) => (
        <div key={autogeneratedIds[index]}>
          {transactions.length > 1 && (
            <div
              className={classnames(styles.transactionHeading, {
                [styles.transactionHeadingOpen]: transactionTabStatus[index],
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
                  transactionNumber: index + 1,
                  transactionType: getTransactionTypeLabel(
                    transaction.transactionType,
                  ),
                }}
              />
              <Button
                className={styles.tabButton}
                onClick={() => handleTabToggle(index)}
              >
                <Icon
                  name="caret-up"
                  className={styles.toggleTabIcon}
                  title={MSG.toggleTransaction}
                  titleValues={{
                    tabToggleStatus: transactionTabStatus[index],
                  }}
                />
              </Button>
            </div>
          )}
          <div
            className={classnames({
              [styles.tabContentClosed]:
                transactions.length > 1 && !transactionTabStatus[index],
            })}
          >
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.transactionDetailsSection}>
                {transactions[index].transactionType !== '' &&
                  transactions.length === 1 && (
                    <div className={styles.transactionTitle}>
                      1.{' '}
                      <FormattedMessage
                        {...ConstantsMSG[transactions[index].transactionType]}
                      />
                    </div>
                  )}
                {!isNFT(index) && (
                  <DetailsItem
                    label={MSG.safe}
                    value={
                      <AddressDetailsView
                        item={safe as never as User}
                        isSafeItem
                      />
                    }
                  />
                )}
                {transactions[index].transactionType !==
                  TransactionTypes.CONTRACT_INTERACTION &&
                  !isNFT(index) && (
                    <DetailsItem
                      label={MSG.to}
                      value={
                        <AddressDetailsView
                          item={transactions[index].recipient as never as User}
                          isSafeItem={false}
                        />
                      }
                    />
                  )}
                {transactions[index].transactionType !== '' &&
                  transactionTypeFieldsMap[
                    transactions[index].transactionType
                  ].map(({ key, label, value }) => (
                    <DetailsItem
                      key={nanoid()}
                      label={label}
                      value={value(transactions[index][key], tokens[index])}
                    />
                  ))}
                {transactions[index].transactionType ===
                  TransactionTypes.CONTRACT_INTERACTION &&
                  selectedContractMethods &&
                  selectedContractMethods[index]?.inputs?.map((input) => {
                    const functionKey = `${input.name}-${transactions[index].contractFunction}`;
                    return (
                      <DetailsItem
                        key={nanoid()}
                        label={MSG.contractMethodInputLabel}
                        textValues={{ name: input.name, type: input.type }}
                        value={formatArgument(
                          input.type || '',
                          transactions[index][functionKey],
                          input.type?.substring(input.type.length - 2) === '[]',
                        )}
                      />
                    );
                  })}
              </div>
            </DialogSection>
          </div>
        </div>
      ))}
      <div className={styles.footer}>
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <Input
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            label={MSG.transactionsTitle}
            name="transactionsTitle"
            disabled={disabledInput}
          />
        </DialogSection>
        <DialogSection>
          <Annotations
            label={MSG.description}
            name="annotation"
            disabled={disabledInput}
          />
        </DialogSection>
      </div>
    </>
  );
};

SafeTransactionPreview.displayName = displayName;

export default SafeTransactionPreview;
