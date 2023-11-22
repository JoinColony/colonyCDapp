import React, { FC } from 'react';
import { useTokensModalContext } from '~context';
import { formatText } from '~utils/intl';
import { TOKENS_MODAL_TYPES } from '~v5/common/TokensModal/consts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep.partials.NotEnoughTokensInfo';

const NotEnoughTokensInfo: FC = () => {
  const { toggleOnTokensModal, setTokensModalType } = useTokensModalContext();

  return (
    <>
      <p className="text-sm mb-1">
        {formatText({
          id: 'motion.staking.notEnoughTokens',
        })}
      </p>
      <button
        type="button"
        className="text-4 underline transition-all md:hover:opacity-80"
        onClick={() => {
          toggleOnTokensModal();
          setTokensModalType(TOKENS_MODAL_TYPES.activate);
        }}
      >
        {formatText({
          id: 'motion.staking.activateTokens',
        })}
      </button>
    </>
  );
};

NotEnoughTokensInfo.displayName = displayName;

export default NotEnoughTokensInfo;
