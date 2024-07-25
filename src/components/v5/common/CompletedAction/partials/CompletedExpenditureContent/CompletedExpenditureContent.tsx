import { UserFocus } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { ADDRESS_ZERO } from '~constants';
import { ExpenditureType } from '~gql';
import { useMobile } from '~hooks';
import { type AnyActionType } from '~types/actions.ts';
import {
  type Expenditure,
  type ColonyAction,
  type Domain,
  type ExpenditureSlot,
  type User,
} from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';
import { type MeatBallMenuItem } from '~v5/shared/MeatBallMenu/types.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import ActionData from '../rows/ActionData.tsx';
import ActionTypeRow from '../rows/ActionType.tsx';
import CreatedInRow from '../rows/CreatedIn.tsx';
import DecisionMethodRow from '../rows/DecisionMethod.tsx';
import DescriptionRow from '../rows/Description.tsx';
import TeamFromRow from '../rows/TeamFrom.tsx';

interface CompletedExpenditureContentProps {
  title: string;
  actionType: AnyActionType;
  initiatorUser?: User | undefined | null;
  recipient?: User | undefined | null;
  slots: ExpenditureSlot[];
  selectedTeam: Domain | undefined;
  action: ColonyAction;
  expenditure: Expenditure;
  expenditureMeatballOptions: MeatBallMenuItem[];
  tokensCount?: number;
}

const CompletedExpenditureContent: FC<CompletedExpenditureContentProps> = ({
  title,
  actionType,
  initiatorUser,
  recipient,
  slots,
  selectedTeam,
  action,
  expenditure,
  expenditureMeatballOptions,
  tokensCount,
}) => {
  const isMobile = useMobile();

  return (
    <>
      <div className="flex w-full items-center justify-between gap-2">
        <ActionTitle>{title}</ActionTitle>
        <MeatBallMenu
          contentWrapperClassName={clsx('z-[65] sm:min-w-[11.25rem]', {
            '!left-6 right-6': isMobile,
          })}
          dropdownPlacementProps={{
            top: 12,
          }}
          items={expenditureMeatballOptions}
        />
      </div>
      <ActionSubtitle>
        {formatText(
          { id: 'action.title' },
          {
            actionType,
            initiator: initiatorUser ? (
              <UserInfoPopover
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserInfoPopover>
            ) : null,
            recipient: recipient ? (
              <UserInfoPopover
                walletAddress={recipient.walletAddress || ''}
                user={recipient}
                withVerifiedBadge={false}
              >
                {recipient.profile?.displayName}
              </UserInfoPopover>
            ) : null,
            recipientsNumber: slots?.length,
            tokensNumber: tokensCount,
          },
        )}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={actionType} />
        {selectedTeam?.metadata && (
          <TeamFromRow
            teamMetadata={selectedTeam.metadata}
            actionType={action.type}
          />
        )}
        {expenditure.type === ExpenditureType.Staged && (
          <ActionData
            rowLabel={formatText({ id: 'actionSidebar.recipient' })}
            rowContent={
              <UserPopover
                walletAddress={slots[0].recipientAddress || ADDRESS_ZERO}
                size={20}
              />
            }
            RowIcon={UserFocus}
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.simplePayment.recipient',
            })}
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
    </>
  );
};

export default CompletedExpenditureContent;
