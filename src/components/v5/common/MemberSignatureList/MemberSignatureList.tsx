import React, { FC } from 'react';

import { notNull, notUndefined } from '~utils/arrays';
import { SpinnerLoader } from '~shared/Preloaders';
import MemberSignature from '../MemberSignature';
import { MemberSignatureListProps } from './types';

const displayName = 'v5.common.MemberSignatureList';

const MemberSignatureList: FC<MemberSignatureListProps> = ({
  items,
  isLoading,
  title,
  checkedUsersList,
}) => {
  // @TODO: Use this data in recovery mode signatures list component
  // const { loading, usersWithRecoveryRole } = useGetMembersWithRecovery();
  const shouldShowList = !isLoading && items && items.length;

  const mappedItems = items.map((user) => {
    const isChecked = checkedUsersList?.includes(user.walletAddress);

    return {
      user,
      isChecked,
    };
  });

  return (
    <div>
      <h3 className="text-1 mb-2">{title}</h3>
      {isLoading && (
        <div className="flex justify-center">
          <SpinnerLoader appearance={{ size: 'medium' }} />
        </div>
      )}
      {shouldShowList && (
        <ul>
          {mappedItems
            .filter(notNull)
            .filter(notUndefined)
            .map(({ isChecked, user }) => (
              <li key={user.walletAddress} className="mb-3 last:mb-0">
                {/* @TODO: Implement signed/not signed state */}
                <MemberSignature user={user} isChecked={isChecked} />
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

MemberSignatureList.displayName = displayName;

export default MemberSignatureList;
