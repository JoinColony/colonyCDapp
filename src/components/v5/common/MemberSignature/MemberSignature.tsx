import React, { FC } from 'react';

import { useIntl } from 'react-intl';
import UserAvatar from '~v5/shared/UserAvatar';
import { MemberSignatureProps } from './types';

const displayName = 'v5.common.MemberSignature';

const MemberSignature: FC<MemberSignatureProps> = ({ user, isSigned }) => {
  const { formatMessage } = useIntl();

  const { name, profile } = user;
  const { displayName: userDisplayName } = profile || {};

  return (
    <div className="flex items-center justify-between">
      <UserAvatar user={user} size="xs" userName={userDisplayName || name} />
      <span className="text-sm">
        {formatMessage({
          id: isSigned
            ? 'common.memberSignature.signed'
            : 'common.memberSignature.notSigned',
        })}
      </span>
    </div>
  );
};

MemberSignature.displayName = displayName;

export default MemberSignature;
