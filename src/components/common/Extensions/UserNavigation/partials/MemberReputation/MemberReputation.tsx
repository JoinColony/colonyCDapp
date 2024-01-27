import clsx from 'clsx';
import React, { FC } from 'react';

import useUserReputation from '~hooks/useUserReputation.ts';
import Icon from '~shared/Icon/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { ZeroValue, calculatePercentageReputation } from '~utils/reputation.ts';

import { MemberReputationProps } from './types.ts';

export const displayName =
  'common.Extensions.UserNavigation.partials.MemberReputation';

const MemberReputation: FC<MemberReputationProps> = ({
  colonyAddress,
  domainId,
  hideOnMobile = true,
  rootHash,
  textClassName = 'text-3',
  walletAddress,
}) => {
  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    walletAddress,
    domainId,
    rootHash,
  );
  const percentageReputation = calculatePercentageReputation(
    userReputation,
    totalReputation,
  );

  return (
    <div
      className={clsx({
        'hidden md:flex md:items-center': hideOnMobile,
        'flex items-center': !hideOnMobile,
      })}
    >
      <Icon name="star" appearance={{ size: 'tiny' }} />
      <span className={clsx(textClassName, 'ml-1')}>
        {!percentageReputation && '— %'}
        {percentageReputation === ZeroValue.NearZero && percentageReputation}
        {percentageReputation &&
          percentageReputation !== ZeroValue.NearZero && (
            <Numeral value={percentageReputation} suffix="%" />
          )}
      </span>
    </div>
  );
};

MemberReputation.displayName = displayName;

export default MemberReputation;
