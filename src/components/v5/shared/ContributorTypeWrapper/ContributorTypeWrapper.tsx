import clsx from 'clsx';
import React, { type PropsWithChildren } from 'react';

import { ContributorType } from '~gql';

const displayName = 'v5.ContributorTypeWrapper';

type ContributorTypeWrapperProps = PropsWithChildren<{
  contributorType: ContributorType;
}>;

const ContributorTypeWrapper = ({
  children,
  contributorType,
}: ContributorTypeWrapperProps) => {
  if (contributorType === ContributorType.General) {
    return <>{children}</>;
  }

  return (
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
  );
};

ContributorTypeWrapper.displayName = displayName;
export default ContributorTypeWrapper;
