import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { UserFocus } from '@phosphor-icons/react';
import { BigNumber } from 'ethers';
import React, { type FC } from 'react';

import { ADDRESS_ZERO, DEFAULT_TOKEN_DECIMALS } from '~constants';
import { Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { formatText } from '~utils/intl.ts';
import { formatReputationChange } from '~utils/reputation.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TITLE_FIELD_NAME,
  TEAM_FIELD_NAME,
  AMOUNT_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useGetActionData from '~v5/common/ActionSidebar/hooks/useGetActionData.ts';
import { ModificationOption } from '~v5/common/ActionSidebar/partials/forms/ManageReputationForm/consts.ts';
import { useDecisionMethod } from '~v5/common/CompletedAction/hooks.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import {
  ActionData,
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
  ModificationRow,
  TeamFromRow,
} from '../rows/index.ts';
import { getFormattedTokenAmount } from '../utils.ts';

import ManageReputationTableCompletedState from './partials/ManageReputationTableCompletedState/index.ts';
import ManageReputationTableInMotion from './partials/ManageReputationTableInMotion/index.ts';
import { type ManageReputationProps } from './types.ts';

const displayName = 'v5.common.CompletedAction.partials.ManageReputation';

const ManageReputation: FC<ManageReputationProps> = ({ action }) => {
  const decisionMethod = useDecisionMethod(action);
  const { colony } = useColonyContext();
  const { nativeToken } = colony;
  const {
    isMotion,
    transactionHash,
    metadata,
    initiatorUser,
    recipientUser,
    recipientAddress,
    amount,
    fromDomain,
    annotation,
  } = action;
  const { networkMotionState } = useGetActionData(transactionHash);
  const motionFinished =
    networkMotionState === NetworkMotionState.Finalizable ||
    networkMotionState === NetworkMotionState.Finalized ||
    networkMotionState === NetworkMotionState.Failed;

  const isSmite = [
    ColonyActionType.EmitDomainReputationPenalty,
    ColonyActionType.EmitDomainReputationPenaltyMotion,
    ColonyActionType.EmitDomainReputationPenaltyMultisig,
  ].includes(action.type);

  const positiveAmountValue = BigNumber.from(amount || '0')
    .abs()
    .toString();

  const formattedAmount = getFormattedTokenAmount(
    positiveAmountValue,
    DEFAULT_TOKEN_DECIMALS,
  );

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>
          {metadata?.customTitle ||
            formatText({ id: 'actions.manageReputation' })}
        </ActionTitle>
        <MeatballMenu
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: metadata?.customTitle,
            [ACTION_TYPE_FIELD_NAME]: Action.ManageReputation,
            member: recipientAddress,
            modification: isSmite
              ? ModificationOption.RemoveReputation
              : ModificationOption.AwardReputation,
            [TEAM_FIELD_NAME]: fromDomain?.nativeId,
            [AMOUNT_FIELD_NAME]: formattedAmount,
            [DECISION_METHOD_FIELD_NAME]: decisionMethod,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
          }}
        />
      </div>
      <ActionSubtitle>
        {formatText(
          {
            id: 'action.title',
          },
          {
            actionType: action.type,
            initiator: initiatorUser ? (
              <UserInfoPopover
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserInfoPopover>
            ) : null,
            recipient: recipientAddress ? (
              <UserInfoPopover
                walletAddress={recipientAddress}
                user={recipientUser}
                withVerifiedBadge={false}
              >
                {recipientUser?.profile?.displayName ||
                  splitWalletAddress(recipientAddress)}
              </UserInfoPopover>
            ) : null,
            reputationChange: amount
              ? formatReputationChange(
                  amount,
                  getTokenDecimalsWithFallback(nativeToken.decimals),
                )
              : '0',
            reputationChangeNumeral: positiveAmountValue ? (
              <Numeral
                value={positiveAmountValue}
                decimals={getTokenDecimalsWithFallback(nativeToken.decimals)}
              />
            ) : (
              formatText({
                id: 'actionSidebar.metadataDescription.anAmount',
              })
            ),
          },
        )}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />
        <ModificationRow isSmite={isSmite} />
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.member' })}
          rowContent={
            <UserPopover
              walletAddress={action.recipientAddress || ADDRESS_ZERO}
              size={20}
            />
          }
          RowIcon={UserFocus}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.simplePayment.recipient',
          })}
        />
        {action.fromDomain?.metadata && (
          <TeamFromRow
            teamMetadata={action.fromDomain.metadata}
            actionType={action.type}
          />
        )}
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
      {positiveAmountValue && (
        <>
          {isMotion && !motionFinished ? (
            <ManageReputationTableInMotion
              isSmite={isSmite}
              amount={positiveAmountValue}
              member={recipientUser?.walletAddress}
              domainId={action.fromDomain?.nativeId || 0}
              className="mt-6"
            />
          ) : (
            <ManageReputationTableCompletedState
              isSmite={isSmite}
              amount={positiveAmountValue}
              className="mt-6"
              recipientAddress={recipientAddress}
              domainId={fromDomain?.nativeId}
              rootHash={action.rootHash}
            />
          )}
        </>
      )}
    </>
  );
};

ManageReputation.displayName = displayName;
export default ManageReputation;
