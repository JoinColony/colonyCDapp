import classNames from 'classnames';
import React, { ReactNode } from 'react';

import { ETHEREUM_NETWORK } from '~constants';
import {
  TRANSACTION_STATUS,
  useColonyContext,
  useSafeTransactionStatus,
} from '~hooks';
import { ColonyAction } from '~types';
import { getExtendedActionType, safeActionTypes } from '~utils/colonyActions';

import SafeTransactionBanner from '../SafeTransactionBanner';

import styles from './ActionDetailsPageLayout.css';

interface ActionsPageLayoutProps {
  children: ReactNode;
  actionData?: ColonyAction;
  center?: boolean;
  isMotion?: boolean;
}

const displayName = 'common.ColonyActions.ActionDetailsPageLayout';

const ActionDetailsPageLayout = ({
  children,
  actionData,
  center = false,
  isMotion = false,
}: ActionsPageLayoutProps) => {
  const { colony } = useColonyContext();
  const safeTransactionStatus = useSafeTransactionStatus(actionData);

  const hasPendingSafeTransactions = safeTransactionStatus.find(
    (transactionStatus) =>
      transactionStatus === TRANSACTION_STATUS.ACTION_NEEDED,
  );

  const extendedActionType = actionData
    ? getExtendedActionType(actionData, colony.metadata)
    : undefined;

  return (
    <div
      className={classNames(styles.layout, {
        [styles.center]: center,
        [styles.noTopPadding]: isMotion && !hasPendingSafeTransactions,
      })}
    >
      {hasPendingSafeTransactions &&
        safeActionTypes.some((type) => extendedActionType?.includes(type)) && (
          <SafeTransactionBanner
            chainId={(
              actionData?.safeTransaction?.safe?.chainId ||
              ETHEREUM_NETWORK.chainId
            ).toString()}
            transactionHash={actionData?.safeTransaction?.id || ''}
          />
        )}
      <div className={styles.main}>{children}</div>
    </div>
  );
};

ActionDetailsPageLayout.displayName = displayName;

export default ActionDetailsPageLayout;
