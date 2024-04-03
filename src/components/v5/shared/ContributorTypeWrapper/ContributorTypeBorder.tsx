import clsx from 'clsx';
import React from 'react';
import { type PropsWithChildren } from 'react';

import { ContributorType } from '~gql';

const displayName = 'v5.ContributorTypeBorder';

type ContributorTypeBorderProps = PropsWithChildren<{
  contributorType?: ContributorType;
}>;

const ContributorTypeBorder = ({
  children,
  contributorType,
}: ContributorTypeBorderProps) => {
  if (!contributorType || contributorType === ContributorType.General) {
    return <>{children}</>;
  }

  return (
    <span
      className={clsx('flex rounded-full border-2', {
        'border-blue-400': contributorType === ContributorType.Dedicated,
        'border-warning-400': contributorType === ContributorType.Active,
        'border-success-400': contributorType === ContributorType.New,
        'border-purple-400': contributorType === ContributorType.Top,
      })}
    >
      {children}
    </span>
  );
};

ContributorTypeBorder.displayName = displayName;
export default ContributorTypeBorder;
