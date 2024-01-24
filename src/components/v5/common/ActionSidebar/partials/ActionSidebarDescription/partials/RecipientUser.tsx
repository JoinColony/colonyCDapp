import React from 'react';

import useUserByAddress from '~hooks/useUserByAddress';
import MaskedAddress from '~shared/MaskedAddress';
import { MiniSpinnerLoader } from '~shared/Preloaders';
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
  const { error, loading, user } = useUserByAddress(userAddress);

  if (error) {
    return <>{formatText({ id: 'error.message' })}</>;
  }

  if (loading && !user) {
    return <MiniSpinnerLoader className="mx-1" />;
  }

  if (!user) {
    return <>{noUserText}</>;
  }

  if (user.profile) {
    return <>{user.profile.displayName}</>;
  }

  return <MaskedAddress address={user.walletAddress} />;
};

RecipientUser.displayName = displayName;
export default RecipientUser;
