import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ColonyActionType } from '~gql';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { formatText } from '~utils/intl.ts';
import { toFinite } from '~utils/lodash.ts';
import { getSafeStringifiedNumber } from '~utils/numbers.ts';
import { formatReputationChange } from '~utils/reputation.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { ModificationOption } from '~v5/common/ActionSidebar/partials/forms/ManageReputationForm/consts.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

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
      <UserInfoPopover
        walletAddress={member}
        user={user}
        withVerifiedBadge={false}
        className="!inline-flex"
      >
        {user?.profile?.displayName || splitWalletAddress(member)}
      </UserInfoPopover>
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
          toFinite(amount),
          getTokenDecimalsWithFallback(nativeToken.decimals),
        ),
        reputationChangeNumeral: amount ? (
          <Numeral value={toFinite(getSafeStringifiedNumber(amount))} />
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
