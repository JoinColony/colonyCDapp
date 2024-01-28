import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useTokensModalContext } from '~context/TokensModalContext.tsx';
import { formatText } from '~utils/intl.ts';
import { TOKENS_MODAL_TYPES } from '~v5/common/TokensModal/consts.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.StakingStep.partials.NotEnoughTokensInfo';

const MSG = defineMessages({
  notEnoughTokens: {
    id: `${displayName}.notEnoughTokens`,
    defaultMessage: `You don’t have enough tokens to be able to stake!`,
  },
  activateTokens: {
    id: `${displayName}.activateTokens`,
    defaultMessage: 'Activate tokens',
  },
});

const NotEnoughTokensInfo: FC = () => {
  const { toggleOnTokensModal, setTokensModalType } = useTokensModalContext();

  return (
    <>
      <p className="text-sm mb-1">{formatText(MSG.notEnoughTokens)}</p>
      <button
        type="button"
        className="text-4 underline transition-all md:hover:opacity-80"
        onClick={() => {
          toggleOnTokensModal();
          setTokensModalType(TOKENS_MODAL_TYPES.activate);
        }}
      >
        {formatText(MSG.activateTokens)}
      </button>
    </>
  );
};

NotEnoughTokensInfo.displayName = displayName;

export default NotEnoughTokensInfo;
