import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import MemberSignature from '../MemberSignature';
import { useGetMembersWithRecovery } from './hooks';
import { notNull, notUndefined } from '~utils/arrays';
import { SpinnerLoader } from '~shared/Preloaders';

const displayName = 'v5.common.RecoveryPermissionsMembers';

const RecoveryPermissionsMembers: FC = () => {
  const { loading, usersWithRecoveryRole } = useGetMembersWithRecovery();
  const { formatMessage } = useIntl();

  const shouldShowList =
    !loading && usersWithRecoveryRole && usersWithRecoveryRole.length;

  return (
    <div>
      <h3 className="text-1 mb-2">
        {formatMessage({ id: 'common.recoveryPermissionsMembers.title' })}
      </h3>
      {loading && (
        <div className="flex justify-center">
          <SpinnerLoader appearance={{ size: 'medium' }} />
        </div>
      )}
      <ul>
        {shouldShowList &&
          usersWithRecoveryRole
            .map((item) => item?.user)
            .filter(notNull)
            .filter(notUndefined)
            .map((user) => (
              <li key={user.walletAddress} className="mb-3 last:mb-0">
                {/* @TODO: Implement signed/not signed state */}
                <MemberSignature user={user} isSigned={false} />
              </li>
            ))}
      </ul>
    </div>
  );
};

RecoveryPermissionsMembers.displayName = displayName;

export default RecoveryPermissionsMembers;
