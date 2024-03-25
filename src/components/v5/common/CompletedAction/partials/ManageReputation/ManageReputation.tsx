import { MotionState as NetworkMotionState } from '@colony/colony-js';
import { UserFocus } from '@phosphor-icons/react';
import { BigNumber } from 'ethers';
import React, { type FC } from 'react';

import { ADDRESS_ZERO, DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { formatText } from '~utils/intl.ts';
import { formatReputationChange } from '~utils/reputation.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import useGetActionData from '~v5/common/ActionSidebar/hooks/useGetActionData.ts';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover/index.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import {
  ActionData,
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
  ModificationRow,
  TeamFromRow,
} from '../rows/index.ts';

import ManageReputationTableCompletedState from './partials/ManageReputationTableCompletedState/index.ts';
import ManageReputationTableInMotion from './partials/ManageReputationTableInMotion/index.ts';
import { type ManageReputationProps } from './types.ts';

const displayName = 'v5.common.CompletedAction.partials.ManageReputation';

const ManageReputation: FC<ManageReputationProps> = ({ action }) => {
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
  } = action;
  const { networkMotionState } = useGetActionData(transactionHash);
  const motionFinished =
    networkMotionState === NetworkMotionState.Finalizable ||
    networkMotionState === NetworkMotionState.Finalized ||
    networkMotionState === NetworkMotionState.Failed;

  const isSmite =
    action.type === ColonyActionType.EmitDomainReputationPenalty ||
    action.type === ColonyActionType.EmitDomainReputationPenaltyMotion;

  const positiveAmountValue = BigNumber.from(amount || '0')
    .abs()
    .toString();

  return (
    <>
      <ActionTitle>
        {metadata?.customTitle ||
          formatText({ id: 'actions.manageReputation' })}
      </ActionTitle>
      <ActionSubtitle>
        {formatText(
          {
            id: 'action.title',
          },
          {
            actionType: action.type,
            initiator: initiatorUser ? (
              <UserPopover
                userName={initiatorUser.profile?.displayName}
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserPopover>
            ) : null,
            recipient: recipientAddress ? (
              <UserPopover
                userName={recipientUser?.profile?.displayName}
                walletAddress={recipientAddress}
                user={recipientUser}
                withVerifiedBadge={false}
              >
                {recipientUser?.profile?.displayName ||
                  splitWalletAddress(recipientAddress)}
              </UserPopover>
            ) : null,
            reputationChange: amount
              ? formatReputationChange(
                  amount,
                  getTokenDecimalsWithFallback(
                    nativeToken.decimals,
                    DEFAULT_TOKEN_DECIMALS,
                  ),
                )
              : '0',
            reputationChangeNumeral: positiveAmountValue ? (
              <Numeral
                value={positiveAmountValue}
                decimals={getTokenDecimalsWithFallback(
                  nativeToken.decimals,
                  DEFAULT_TOKEN_DECIMALS,
                )}
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
            <UserAvatarPopover
              walletAddress={action.recipientAddress || ADDRESS_ZERO}
              size="xs"
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
        <DecisionMethodRow isMotion={action.isMotion || false} />
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
