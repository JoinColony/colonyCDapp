import React, { type FC } from 'react';

import { Action } from '~constants/actions.ts';
import { type ColonyAction, ColonyActionType } from '~types/graphql.ts';
import {
  decodeArbitraryTransaction,
  getFormatValuesArbitraryTransactions,
} from '~utils/arbitraryTxs.ts';
import { formatText } from '~utils/intl.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  ARBITRARY_TRANSACTIONS_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { useDecisionMethod } from '~v5/common/CompletedAction/hooks.ts';
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

interface ArbitraryTransactionProps {
  action: ColonyAction;
}

const ArbitraryTransaction: FC<ArbitraryTransactionProps> = ({ action }) => {
  const decisionMethod = useDecisionMethod(action);
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
  const { initiatorUser, transactionHash, annotation, arbitraryTransactions } =
    action;

  const decodedArbitraryTransactions = arbitraryTransactions?.map(
    ({ contractAddress, encodedFunction }) => {
      const abi = action.metadata?.arbitraryTxAbis?.find(
        (abiItem) => abiItem.contractAddress === contractAddress,
      );
      if (!abi) {
        return {
          contractAddress,
        };
      }

      const decodedTx = decodeArbitraryTransaction(
        abi.jsonAbi,
        encodedFunction,
      );
      return {
        contractAddress,
        jsonAbi: abi,
        ...decodedTx,
      };
    },
  );

  const arbitraryMessageValues = getFormatValuesArbitraryTransactions(action);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: Action.ArbitraryTxs,
            [DECISION_METHOD_FIELD_NAME]: decisionMethod,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
            [ARBITRARY_TRANSACTIONS_FIELD_NAME]: decodedArbitraryTransactions,
          }}
        />
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
            ...arbitraryMessageValues,
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

      <ArbitraryTransactionsTable action={action} />
    </>
  );
};

export default ArbitraryTransaction;
