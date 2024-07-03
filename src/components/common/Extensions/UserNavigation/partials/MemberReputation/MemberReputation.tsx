import { Star } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import useUserReputation from '~hooks/useUserReputation.ts';
import Numeral from '~shared/Numeral/index.ts';
import { ZeroValue, calculatePercentageReputation } from '~utils/reputation.ts';

import { type MemberReputationProps } from './types.ts';

const displayName =
  'common.Extensions.UserNavigation.partials.MemberReputation';

const MemberReputation: FC<MemberReputationProps> = ({
  colonyAddress,
  domainId,
  hideOnMobile = true,
  rootHash,
  textClassName = 'text-3',
  walletAddress,
}) => {
  const { userReputation, totalReputation } = useUserReputation({
    colonyAddress,
    walletAddress,
    domainId,
    rootHash,
  });
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
      <Star size={14} />
      <span className={clsx(textClassName, 'ml-1')}>
        {!percentageReputation && '— %'}
        {percentageReputation === ZeroValue.NearZero && percentageReputation}
        {percentageReputation &&
          percentageReputation !== ZeroValue.NearZero && (
            <>
              <Numeral value={percentageReputation} />%
            </>
          )}
      </span>
    </div>
  );
};

MemberReputation.displayName = displayName;

export default MemberReputation;
