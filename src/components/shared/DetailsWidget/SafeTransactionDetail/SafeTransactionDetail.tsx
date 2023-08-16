import React, { useState } from 'react';
import classnames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';

import Numeral from '~shared/Numeral';
import Avatar from '~shared/Avatar';
import { Colony, Safe } from '~types';
import { MSG as TypesMSG } from '~common/Dialogs/ControlSafeDialog/helpers';
import { TransactionTypes } from '~utils/safes';
import { SafeTransaction } from '~common/Dialogs/ControlSafeDialog/types';

import {
  ContractName,
  ContractSection,
  nftMSG,
  Recipient,
  Title,
  Value,
} from '../SafeTransactionDetail';
import FunctionsSection from '../SafeTransactionDetail/components/FunctionsSection';

import widgetStyles from '../DetailsWidget.css';
import styles from './SafeTransactionDetail.css';

const displayName = 'DetailsWidget.SafeTransactionDetail';

const MSG = defineMessages({
  tokenId: {
    id: `${displayName}.tokenId`,
    defaultMessage: `Token Id`,
  },
  value: {
    id: `${displayName}.value`,
    defaultMessage: `Value (wei)`,
  },
  data: {
    id: `${displayName}.data`,
    defaultMessage: `Data`,
  },
});

interface Props {
  safe: Safe;
  safeTransactionDetails: SafeTransaction[];
  colony: Colony;
  safeTransactionDetailStatuses: string[];
}

const SafeTransactionDetail = ({
  safe,
  safeTransactionDetails,
  safeTransactionDetailStatuses,
}: Props) => {
  const [openWidgets, setOpenWidgets] = useState<boolean[]>(
    new Array(safeTransactionDetails.length).fill(true),
  );
  return (
    <div className={styles.main}>
      {safeTransactionDetails.map((transaction, index, transactions) => {
        const setIsOpen = () => {
          setOpenWidgets((widgets) => {
            const updated = [...widgets];
            updated[index] = !updated[index];
            return updated;
          });
        };
        const idx = transactions.length > 1 ? index + 1 : null;
        const { token } = transaction;
        const NFT = transaction.nftData;
        const renderWidget = () => {
          switch (transaction.transactionType) {
            case TransactionTypes.TRANSFER_FUNDS:
              return (
                <>
                  <Title
                    index={idx}
                    transactionStatus={safeTransactionDetailStatuses[index]}
                    title={TypesMSG.transferFunds}
                    {...{
                      isOpen: openWidgets[index],
                      setIsOpen,
                    }}
                  />
                  {openWidgets[index] && (
                    <>
                      <ContractSection transaction={transaction} safe={safe} />
                      {transaction.recipient && (
                        <Recipient recipient={transaction.recipient} />
                      )}
                      {transaction.amount && token && (
                        <Value transaction={transaction} token={token} />
                      )}
                    </>
                  )}
                </>
              );
            case TransactionTypes.TRANSFER_NFT:
              return (
                <>
                  <Title
                    index={idx}
                    transactionStatus={safeTransactionDetailStatuses[index]}
                    title={TypesMSG.transferNft}
                    {...{ isOpen: openWidgets[index], setIsOpen }}
                  />
                  {openWidgets[index] && (
                    <>
                      <ContractSection transaction={transaction} safe={safe} />
                      {transaction.recipient && (
                        <Recipient recipient={transaction.recipient} />
                      )}
                      {NFT && (
                        <div className={widgetStyles.item}>
                          <div className={widgetStyles.label}>
                            <FormattedMessage {...MSG.tokenId} />
                          </div>
                          <div className={widgetStyles.value}>
                            <span>{NFT.id}</span>
                          </div>
                        </div>
                      )}
                      <div className={widgetStyles.item}>
                        <div className={widgetStyles.label}>
                          <FormattedMessage {...nftMSG} />
                        </div>
                        <div className={styles.nft}>
                          <div className={widgetStyles.value}>
                            <span title={transaction.nft?.profile.displayName}>
                              {transaction.nft?.profile.displayName}
                            </span>
                          </div>
                          <Avatar
                            notSet={!NFT?.imageUri}
                            avatar={NFT?.imageUri || undefined}
                            seed={NFT?.address?.toLocaleLowerCase()}
                            placeholderIcon="nft-icon"
                            title="nftImage"
                            size="s"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              );
            case TransactionTypes.CONTRACT_INTERACTION:
              return (
                <>
                  <Title
                    index={idx}
                    transactionStatus={safeTransactionDetailStatuses[index]}
                    title={TypesMSG.contractInteraction}
                    {...{ isOpen: openWidgets[index], setIsOpen }}
                  />
                  {openWidgets[index] && (
                    <>
                      <ContractSection
                        transaction={transaction}
                        safe={safe}
                        hideFunctionContract
                      />
                      <FunctionsSection transaction={transaction} />
                    </>
                  )}
                </>
              );
            case TransactionTypes.RAW_TRANSACTION:
              return (
                <>
                  <Title
                    index={idx}
                    transactionStatus={safeTransactionDetailStatuses[index]}
                    title={TypesMSG.rawTransaction}
                    {...{ isOpen: openWidgets[index], setIsOpen }}
                  />
                  {openWidgets[index] && (
                    <>
                      <ContractName name={safe.name} address={safe.address} />
                      {transaction.recipient && (
                        <Recipient recipient={transaction.recipient} />
                      )}
                      {transaction.rawAmount && (
                        <div className={styles.value}>
                          <div className={widgetStyles.item}>
                            <div className={widgetStyles.label}>
                              <FormattedMessage {...MSG.value} />
                            </div>
                            <div className={widgetStyles.value}>
                              <Numeral
                                value={transaction.rawAmount}
                                title={String(transaction.rawAmount)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {transaction.data && (
                        <div className={styles.data}>
                          <div className={widgetStyles.item}>
                            <div className={widgetStyles.label}>
                              <FormattedMessage {...MSG.data} />
                            </div>
                            <div className={widgetStyles.value}>
                              <span>{transaction.data}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              );
            default:
              return null;
          }
        };
        return (
          <section
            key={nanoid()}
            className={classnames({
              [styles.sectionOpen]: openWidgets[index],
            })}
          >
            {renderWidget()}
          </section>
        );
      })}
    </div>
  );
};

SafeTransactionDetail.displayName = displayName;
export default SafeTransactionDetail;
