import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useTokensModalContext } from '~context/TokensModalContext/TokensModalContext.ts';
import { formatText } from '~utils/intl.ts';
import { TokensModalType } from '~v5/common/TokensModal/consts.ts';

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
  const { toggleOnTokensModal } = useTokensModalContext();

  return (
    <>
      <p className="mb-1 text-sm">{formatText(MSG.notEnoughTokens)}</p>
      <button
        type="button"
        className="underline transition-all text-4 md:hover:opacity-80"
        onClick={() => {
          toggleOnTokensModal(TokensModalType.Activate);
        }}
      >
        {formatText(MSG.activateTokens)}
      </button>
    </>
  );
};

NotEnoughTokensInfo.displayName = displayName;

export default NotEnoughTokensInfo;
