import React, { FC } from 'react';
import { formatText } from '~utils/intl';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep.partials.NotEnoughTokensInfo';

const NotEnoughTokensInfo: FC = () => (
  <>
    <p className="text-sm mb-1">
      {formatText({
        id: 'motion.staking.notEnoughTokens',
      })}
    </p>
    <button
      type="button"
      className="text-4 underline transition-all md:hover:opacity-80"
      // @todo: add a toggler to open activate tokens modal
      onClick={() => {}}
    >
      {formatText({
        id: 'motion.staking.activateTokens',
      })}
    </button>
  </>
);

NotEnoughTokensInfo.displayName = displayName;

export default NotEnoughTokensInfo;
