import React, { type PropsWithChildren } from 'react';

import { ContributorType } from '~gql';
import { formatText } from '~utils/intl.ts';
import { type UserStatusMode } from '~v5/common/Pills/types.ts';
import UserStatus from '~v5/common/Pills/UserStatus/index.ts';

import ContributorTypeBorder from './ContributorTypeBorder.tsx';

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
  // this is suboptimal, but until we refactor the UserStatus component to use ContributorType, it's good enough
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
    <div className="flex flex-col items-center justify-center">
      <ContributorTypeBorder contributorType={contributorType}>
        {children}
      </ContributorTypeBorder>
      {!!userStatus && userStatus !== 'general' && (
        <span className="z-[1] -mt-3.5">
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
