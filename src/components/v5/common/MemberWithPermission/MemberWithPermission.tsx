import React, { FC } from 'react';

import { useIntl } from 'react-intl';
import UserAvatar from '~v5/shared/UserAvatar';
import { MemberWithPermissionProps } from './types';

const displayName = 'v5.common.MemberWithPermission';

const MemberWithPermission: FC<MemberWithPermissionProps> = ({
  user,
  isSigned,
}) => {
  const { formatMessage } = useIntl();
  const { name, profile } = user || {};
  const { displayName: userDisplayName } = profile || {};

  return (
    <div className="flex items-center justify-between">
      <UserAvatar user={user} size="xs" userName={userDisplayName || name} />
      <span className="text-sm">
        {formatMessage({
          id: isSigned
            ? 'common.memberWithPermission.signed'
            : 'common.memberWithPermission.notSigned',
        })}
      </span>
    </div>
  );
};

MemberWithPermission.displayName = displayName;

export default MemberWithPermission;
