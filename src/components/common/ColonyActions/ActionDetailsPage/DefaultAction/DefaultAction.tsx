import React from 'react';

import DetailsWidget from '~shared/DetailsWidget';

import { useColonyContext, useEnabledExtensions } from '~hooks';
import { ColonyAction, ExtendedColonyActionType } from '~types';
import { Forced as ForcedTag } from '~shared/Tag';
import { ETHEREUM_NETWORK } from '~constants';

import SafeTransactionBanner from '../SafeTransactionBanner';

import DefaultActionContent from './DefaultActionContent';

import styles from './DefaultAction.css';
import { getExtendedActionType } from '~utils/colonyActions';

const displayName = 'common.ColonyActions.DefaultAction';

interface DefaultActionProps {
  actionData: ColonyAction;
}

const DefaultAction = ({ actionData }: DefaultActionProps) => {
  const { colony } = useColonyContext();

  const { isVotingReputationEnabled } = useEnabledExtensions();

  if (!colony) {
    return null;
  }

  const hasPendingSafeTransactions = true;

  const extendedActionType = getExtendedActionType(actionData, colony.metadata);

  return (
    <div className={styles.main}>
      {hasPendingSafeTransactions &&
        extendedActionType === ExtendedColonyActionType.SafeTransaction && (
          <SafeTransactionBanner
            chainId={(
              actionData?.safeTransaction?.safe?.chainId ||
              ETHEREUM_NETWORK.chainId
            ).toString()}
            transactionHash={actionData?.safeTransaction?.id || ''}
          />
        )}
      {/* {isMobile && <ColonyHomeInfo showNavigation isMobile />} */}
      {isVotingReputationEnabled && <ForcedTag />}
      <div className={styles.container}>
        <DefaultActionContent actionData={actionData} colony={colony} />
        <DetailsWidget actionData={actionData} colony={colony} />
      </div>
    </div>
  );
};

DefaultAction.displayName = displayName;

export default DefaultAction;
