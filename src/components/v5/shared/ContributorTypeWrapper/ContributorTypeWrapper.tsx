import clsx from 'clsx';
import React, { type PropsWithChildren } from 'react';

import { ContributorType } from '~gql';
import { formatText } from '~utils/intl.ts';
import { type UserStatusMode } from '~v5/common/Pills/types.ts';
import UserStatus from '~v5/common/Pills/UserStatus/index.ts';

const displayName = 'v5.ContributorTypeWrapper';

const getUserStatusMode = (
  contributorType: ContributorType,
): UserStatusMode => {
  switch (contributorType) {
    case ContributorType.New:
      return 'new';
    case ContributorType.Active:
      return 'active';
    case ContributorType.Dedicated:
      return 'dedicated';
    case ContributorType.Top:
      return 'top';
    default:
      return 'general';
  }
};

type ContributorTypeWrapperProps = PropsWithChildren<{
  contributorType?: ContributorType;
}>;

const ContributorTypeWrapper = ({
  children,
  contributorType,
}: ContributorTypeWrapperProps) => {
  const userStatus = contributorType
    ? getUserStatusMode(contributorType)
    : undefined;

  if (
    !contributorType ||
    !userStatus ||
    contributorType === ContributorType.General
  ) {
    return <>{children}</>;
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <span
        className={clsx('flex rounded-full border-2', {
          'border-blue-400': contributorType === ContributorType.Dedicated,
          'border-warning-400': contributorType === ContributorType.Active,
          'border-green-400': ContributorType.New,
          'border-purple-400': ContributorType.Top,
        })}
      >
        {children}
      </span>
      {!!userStatus && userStatus !== 'general' && (
        <span className="-mt-3.5 z-[1]">
          <UserStatus
            isFilled
            mode={userStatus}
            text={formatText({ id: userStatus })}
          />
        </span>
      )}
    </div>
  );
};

ContributorTypeWrapper.displayName = displayName;
export default ContributorTypeWrapper;
