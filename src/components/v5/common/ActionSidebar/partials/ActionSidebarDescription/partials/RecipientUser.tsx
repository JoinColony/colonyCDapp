import React from 'react';

import useUserByAddress from '~hooks/useUserByAddress';
import MaskedAddress from '~shared/MaskedAddress';
import { User } from '~types';
import { formatText } from '~utils/intl';

interface RecipientUserProps {
  userAddress: string;
  noUserText?: string;
}

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.RecipientUser';

const RecipientUser = ({
  userAddress,
  noUserText = formatText({
    id: 'actionSidebar.metadataDescription.recipient',
  }),
}: RecipientUserProps) => {
  const { error, loading, user, previousUser } = useUserByAddress(userAddress);

  const getUserText = (member?: User | null) => {
    if (!member) {
      return <>{noUserText}</>;
    }

    if (member.profile) {
      return <>{member.profile.displayName}</>;
    }

    return <MaskedAddress address={member.walletAddress} />;
  };

  if (error) {
    return <>{formatText({ id: 'error.message' })}</>;
  }

  if (loading) {
    return getUserText(previousUser);
  }

  return getUserText(user || previousUser);
};

RecipientUser.displayName = displayName;
export default RecipientUser;
