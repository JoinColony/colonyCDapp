import React, { useState, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { Tooltip } from '~shared/Popover';
// import { useDialog } from '~shared/Dialog';
// import ExternalLink from '~shared/ExternalLink';

// import TransactionAlertDialog from '~dialogs/TransactionAlertDialog';

import { TransactionType } from '~redux/immutable';
import { transactionCancel } from '~redux/actionCreators';
import { getMainClasses } from '~utils/css';
// import {
//   isGasStationMetatransactionError,
//   isMetatransactionErrorFromColonyContract,
// } from '~utils/web3';
import { TRANSACTION_STATUSES } from '~types';
// import { METATRANSACTIONS_LEARN_MORE } from '~constants/externalUrls';

import { Appearance } from '../GasStationContent';
import styles from './GroupedTransactionCard.css';
import TransactionStatus from './TransactionStatus';
// import { GasStationContext } from '../GasStationProvider';

const displayName = 'users.GasStation.GroupedTransactionCard';

const MSG = defineMessages({
  hasDependentTx: {
    id: `${displayName}.hasDependentTx`,
    defaultMessage: 'Dependent transaction',
  },
  failedTx: {
    id: `${displayName}.failedTx`,
    defaultMessage: `{type, select,
      ESTIMATE {Estimation error}
      EVENT_DATA {Event data error}
      RECEIPT {Receipt error}
      SEND {Send error}
      UNSUCCESSFUL {Unsuccessful}
      }: {message}`,
  },
  metaTransactionsAlert: {
    id: `${displayName}.metaTransactionsAlert`,
    /* eslint-disable max-len */
    defaultMessage: `
Colony now covers your gas fees when performing actions on Colony. In order for it to work, your Colony needs to be upgraded to at least v9, the One Transaction Payment extension to at least v3 and Governance (Reputation Weighted) extension to at least v4.

You can toggle this feature, called Metatransactions, in your User Settings under the Advanced Settings tab.

{learnMoreLink}`,
    /* eslint-enable max-len */
  },
});

interface Props {
  appearance: Appearance;
  idx: number;
  selected: boolean;
  transaction: TransactionType;
}

const GroupedTransactionCard = ({
  appearance: { required },
  idx,
  selected,
  transaction: {
    context,
    error,
    id,
    methodContext,
    methodName,
    params,
    status,
    loadingRelated,
    group,
    metatransaction,
    title,
    titleValues,
  },
}: Props) => {
  const dispatch = useDispatch();
  // const { updateTransactionAlert, transactionAlerts } =
  //   useContext(GasStationContext);
  // const openTransactionAlertDialog = useDialog(TransactionAlertDialog);

  const handleCancel = useCallback(() => {
    dispatch(transactionCancel(id));
  }, [dispatch, id]);

  const [isShowingCancelConfirmation, setIsShowingCancelConfirmation] =
    useState(false);

  const toggleCancelConfirmation = useCallback(() => {
    setIsShowingCancelConfirmation(!isShowingCancelConfirmation);
  }, [isShowingCancelConfirmation]);

  /*
   * @TODO This can only be properly tested and made sure it's working
   * when metatransactions are supported by colonyJS
   */
  // useEffect(() => {
  //   if (
  //     isGasStationMetatransactionError(error) &&
  //     isMetatransactionErrorFromColonyContract(error) &&
  //     !transactionAlerts?.[id]?.wasSeen &&
  //     !transactionAlerts?.[id]?.isOpen
  //   ) {
  //     /*
  //      * @NOTE due to the way the dialog provider works you need to pass
  //      * all values being updated to the update function
  //      * (even though it's supposed to handle individual updates as well)
  //      */
  //     updateTransactionAlert(id, { wasSeen: true, isOpen: true });
  //     openTransactionAlertDialog({
  //       text: MSG.metaTransactionsAlert,
  //       textValues: {
  //         learnMoreLink: (
  //           <ExternalLink
  //             href={METATRANSACTIONS_LEARN_MORE}
  //             text={{ id: 'text.learnMore' }}
  //           />
  //         ),
  //       },
  //     })
  //       .afterClosed()
  //       /*
  //        * @NOTE due to the way the dialog provider works you need to pass
  //        * all values being updated to the update function
  //        * (even though it's supposed to handle individual updates as well)
  //        *
  //        * @NOTE2 We need catch in here since clicking outside, or the close
  //        * icon counts as `cancel` rather than `close`, and as to not show
  //        * an error when we really shouldn't
  //        */
  //       .catch(() => null)
  //       /*
  //        * @NOTE We need to perform the action in the `finally` block in order
  //        * to account for both the `cancel` and the `close` actions
  //        */
  //       .finally(() =>
  //         updateTransactionAlert(id, { wasSeen: true, isOpen: false }),
  //       );
  //   }
  // }, [
  //   error,
  //   id,
  //   openTransactionAlertDialog,
  //   transactionAlerts,
  //   updateTransactionAlert,
  // ]);

  const ready = status === TRANSACTION_STATUSES.READY;
  const failed = status === TRANSACTION_STATUSES.FAILED;
  const succeeded = status === TRANSACTION_STATUSES.SUCCEEDED;

  // Only transactions that can be signed can be cancelled
  const canBeSigned = selected && ready;

  // A prior transaction was selected
  const hasDependency = ready && !selected;

  const defaultTransactionMessageDescriptorId = {
    id: `${metatransaction ? 'meta' : ''}transaction.${
      context ? `${context}.` : ''
    }${methodName}.${methodContext ? `${methodContext}.` : ''}title`,
  };

  return (
    <li
      className={getMainClasses({}, styles, {
        failed,
        isShowingCancelConfirmation,
        selected,
        succeeded,
      })}
    >
      <div className={styles.description}>
        <Tooltip
          content={
            <span>
              <FormattedMessage {...MSG.hasDependentTx} />
            </span>
          }
          trigger={hasDependency ? 'hover' : null}
        >
          <div>
            {`${(group?.index || idx) + 1}. `}
            <FormattedMessage
              {...defaultTransactionMessageDescriptorId}
              {...title}
              values={(titleValues || params) as Record<string, any>}
            />
            {failed && error && (
              <span className={styles.failedDescription}>
                <FormattedMessage {...MSG.failedTx} values={{ ...error }} />
              </span>
            )}
          </div>
        </Tooltip>
      </div>
      {canBeSigned && !required ? (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          {isShowingCancelConfirmation ? (
            <>
              <button
                type="button"
                className={styles.confirmationButton}
                onClick={handleCancel}
              >
                <FormattedMessage {...{ id: 'button.yes' }} />
              </button>
              <span className={styles.cancelDecision}>/</span>
              <button
                type="button"
                className={styles.confirmationButton}
                onClick={toggleCancelConfirmation}
              >
                <FormattedMessage {...{ id: 'button.no' }} />
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={toggleCancelConfirmation}
            >
              <FormattedMessage {...{ id: 'button.cancel' }} />
            </button>
          )}
        </>
      ) : (
        <TransactionStatus status={status} loadingRelated={loadingRelated} />
      )}
    </li>
  );
};

GroupedTransactionCard.displayName = displayName;

export default GroupedTransactionCard;
