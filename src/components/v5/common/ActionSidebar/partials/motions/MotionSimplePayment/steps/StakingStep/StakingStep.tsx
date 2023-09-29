import React, { FC } from 'react';
import { StakingStepProps } from './types';

const StakingStep: FC<StakingStepProps> = ({ className }) => {
  return <div className={className}>StakingStep</div>;
};

export default StakingStep;
