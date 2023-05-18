import React, { FC } from 'react';
import clsx from 'clsx';
import Icon from '~shared/Icon';
import { MemberReputationProps } from './types';
import { ZeroValue, calculatePercentageReputation } from '~utils/reputation';
import Numeral from '~shared/Numeral';

export const displayName = 'common.Extensions.UserNavigation.partials.MemberReputation';

const MemberReputation: FC<MemberReputationProps> = ({ userReputation, totalReputation, hideOnMobile = true }) => {
  const percentageReputation = calculatePercentageReputation(userReputation, totalReputation);

  return (
    <div
      className={clsx('items-center', {
        'hidden md:flex': hideOnMobile,
        flex: !hideOnMobile,
      })}
    >
      <Icon name="star" appearance={{ size: 'tiny' }} />
      <p className="text-sm font-inter font-medium ml-1">
        {!percentageReputation && '— %'}
        {percentageReputation === ZeroValue.NearZero && percentageReputation}
        {percentageReputation && percentageReputation !== ZeroValue.NearZero && (
          <Numeral value={percentageReputation} suffix="%" />
        )}
      </p>
    </div>
  );
};

MemberReputation.displayName = displayName;

export default MemberReputation;
