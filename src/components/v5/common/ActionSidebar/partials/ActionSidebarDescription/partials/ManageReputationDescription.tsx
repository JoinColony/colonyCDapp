import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { formatText } from '~utils/intl.ts';
import { formatReputationChange } from '~utils/reputation.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { ModificationOption } from '../../forms/ManageReputationForm/consts.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ManageReputationDescription';

const ManageReputationDescription: FC = () => {
  const { getValues } = useFormContext();
  const { colony } = useColonyContext();
  const { nativeToken } = colony;
  const formValues = getValues();
  const { modification, amount, member } = formValues;
  const isSmite = modification === ModificationOption.RemoveReputation;
  const { error, loading, user } = useUserByAddress(member);

  const recipientUser =
    member && !loading && !error ? (
      <UserPopover
        userName={user?.profile?.displayName}
        walletAddress={member}
        user={user}
        withVerifiedBadge={false}
        wrapperClassName="!inline-flex"
      >
        {user?.profile?.displayName || splitWalletAddress(member)}
      </UserPopover>
    ) : (
      formatText({
        id: 'actionSidebar.metadataDescription.member',
      })
    );

  if (!modification) {
    return (
      <FormattedMessage id="actionSidebar.metadataDescription.manageReputationPlaceholder" />
    );
  }

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: isSmite
          ? ColonyActionType.EmitDomainReputationPenalty
          : ColonyActionType.EmitDomainReputationReward,
        initiator: <CurrentUser />,
        reputationChange: formatReputationChange(
          amount || '0',
          getTokenDecimalsWithFallback(
            nativeToken.decimals,
            DEFAULT_TOKEN_DECIMALS,
          ),
        ),
        reputationChangeNumeral: amount ? (
          <Numeral value={amount} />
        ) : (
          formatText({
            id: 'actionSidebar.metadataDescription.anAmount',
          })
        ),
        recipient: recipientUser,
      }}
    />
  );
};

ManageReputationDescription.displayName = displayName;
export default ManageReputationDescription;
