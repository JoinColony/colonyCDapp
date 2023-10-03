import React, { FC } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { MemberReputationProps } from './types';
import { ZeroValue, calculatePercentageReputation } from '~utils/reputation';
import Numeral from '~shared/Numeral';

export const displayName =
  'common.Extensions.UserNavigation.partials.MemberReputation';

const MemberReputation: FC<MemberReputationProps> = ({
  userReputation,
  totalReputation,
  hideOnMobile = true,
  textClassName = 'text-3',
}) => {
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
