import React, { FC } from 'react';
import { StakingStepProps } from './types';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep';

const StakingStep: FC<StakingStepProps> = ({ className }) => {
  return <div className={className}>StakingStep</div>;
};

StakingStep.displayName = displayName;

export default StakingStep;
