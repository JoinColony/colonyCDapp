import React, { FC } from 'react';
import Icon from '~shared/Icon/Icon';
import { MemberReputationProps } from './types';
import { ZeroValue, calculatePercentageReputation } from '~utils/reputation';
import Numeral from '~shared/Numeral/Numeral';

export const displayName = 'common.Extensions.UserNavigation.MemberReputation';

const MemberReputation: FC<MemberReputationProps> = ({ userReputation, totalReputation }) => {
  const percentageReputation = calculatePercentageReputation(userReputation, totalReputation);

  return (
    <div className="items-center hidden md:flex">
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
