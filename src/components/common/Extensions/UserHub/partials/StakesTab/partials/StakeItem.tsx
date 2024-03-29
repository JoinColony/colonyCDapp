import React, { type FC } from 'react';
import { FormattedDate, useIntl } from 'react-intl';

import { getActionTitleValues } from '~common/ColonyActions/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import UserStakeStatusBadge from '~v5/common/Pills/UserStakeStatusBadge/index.ts';

import { type StakeItemProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakeItem';

const StakeItem: FC<StakeItemProps> = ({ nativeToken, stake, colony }) => {
  const { formatMessage } = useIntl();

  const stakeItemTitle =
    stake.action?.metadata?.customTitle ||
    stake.action?.decisionData?.title ||
    stake.action?.type;

  return (
    <li className="flex flex-col border-b border-gray-100 py-3.5 first:pt-2 last:pb-6 sm:first:pt-0 sm:last:border-none sm:last:pb-1.5">
      <div className="relative w-full">
        <div className="flex items-center justify-between">
          <div className="mr-2 flex min-w-0 items-center">
            <p className="mr-2 min-w-0 truncate text-1">{stakeItemTitle}</p>
            <span className="text-xs text-gray-400">
              <FormattedDate value={stake.createdAt} />
            </span>
          </div>
          <UserStakeStatusBadge status={stake.status} />
        </div>
        <div className="flex text-xs">
          <div className="mr-2 font-medium">
            <Numeral
              value={stake.amount}
              decimals={nativeToken.decimals}
              suffix={` ${nativeToken.symbol}`}
            />
          </div>
          <div className="text-gray-600">
            {stake.action
              ? formatMessage(
                  { id: 'action.title' },
                  getActionTitleValues({ actionData: stake.action, colony }),
                )
              : '-'}
          </div>
        </div>
      </div>
    </li>
  );
};

StakeItem.displayName = displayName;

export default StakeItem;
