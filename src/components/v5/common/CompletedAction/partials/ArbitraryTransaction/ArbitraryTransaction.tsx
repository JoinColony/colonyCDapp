import React, { type FC } from 'react';

import { type ColonyAction, ColonyActionType } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import ArbitraryTransactionsTable from '../ArbitraryTransactionsTable/index.ts';
import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import {
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows/index.ts';

import { useModifyArbitraryTransaction } from './hooks.ts';

interface ArbitraryTransactionProps {
  action: ColonyAction;
}

const ArbitraryTransaction: FC<ArbitraryTransactionProps> = ({ action }) => {
  const {
    customTitle = formatText(
      {
        id: 'action.type',
      },
      {
        actionType: ColonyActionType.MakeArbitraryTransaction,
      },
    ),
  } = action?.metadata || {};
  const { initiatorUser, transactionHash } = action;

  const data = useModifyArbitraryTransaction(
    action.arbitraryTransactions || [],
    action,
  );

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu showRedoItem={false} transactionHash={transactionHash} />
      </div>
      <ActionSubtitle>
        {formatText(
          {
            id: 'action.title',
          },
          {
            actionType: ColonyActionType.MakeArbitraryTransaction,
            initiator: initiatorUser ? (
              <UserInfoPopover
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserInfoPopover>
            ) : null,
          },
        )}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />
        <DecisionMethodRow action={action} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}

      <ArbitraryTransactionsTable data={data} />
    </>
  );
};

export default ArbitraryTransaction;
