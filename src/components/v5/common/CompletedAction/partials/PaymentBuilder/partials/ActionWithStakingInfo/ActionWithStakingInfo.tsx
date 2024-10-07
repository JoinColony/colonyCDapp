import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { formatText } from '~utils/intl.ts';
import { getNumeralTokenAmount, getSelectedToken } from '~utils/tokens.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';
import UserPopover from '~v5/shared/UserPopover/UserPopover.tsx';

import { type ActionWithStakingInfoProps } from './types.ts';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.ActionWithStakingInfo';

const MSG = defineMessages({
  info: {
    id: `${displayName}.info`,
    defaultMessage: 'Member used staking to create the payment.',
  },
  overview: {
    id: `${displayName}.overview`,
    defaultMessage: 'Overview',
  },
  member: {
    id: `${displayName}.member`,
    defaultMessage: 'Member',
  },
  stakeAmount: {
    id: `${displayName}.stakeAmount`,
    defaultMessage: 'Stake amount',
  },
});

const ActionWithStakingInfo: FC<ActionWithStakingInfoProps> = ({
  userAdddress,
  stakeAmount,
}) => {
  const { colony } = useColonyContext();
  const { nativeToken } = colony;
  const { tokenAddress } = nativeToken;

  const tokenData = getSelectedToken(colony, tokenAddress);
  const formattedAmount = getNumeralTokenAmount(
    stakeAmount,
    tokenData?.decimals || DEFAULT_TOKEN_DECIMALS,
  );

  return (
    <MenuWithStatusText
      statusText={
        <StatusText
          status={StatusTypes.Info}
          textClassName="text-4 text-gray-900"
          iconAlignment="top"
          iconSize={16}
          iconClassName="text-gray-500"
        >
          {formatText(MSG.info)}
        </StatusText>
      }
      sections={[
        {
          key: '1',
          content: (
            <>
              <h4 className="text-1">{formatText(MSG.overview)}</h4>
              {userAdddress && (
                <>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-600">
                      {formatText(MSG.member)}
                    </span>
                    <UserPopover size={18} walletAddress={userAdddress || ''} />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-600">
                      {formatText(MSG.stakeAmount)}
                    </span>
                    <span className="text-sm text-gray-900">
                      {formattedAmount} {tokenData?.symbol}
                    </span>
                  </div>
                </>
              )}
            </>
          ),
        },
      ]}
    />
  );
};

export default ActionWithStakingInfo;
