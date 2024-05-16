import { format } from 'date-fns';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { getActionTitleValues } from '~common/ColonyActions/index.ts';
import { TX_SEARCH_PARAM } from '~routes';
import Numeral from '~shared/Numeral/index.ts';
import UserStakeStatusBadge from '~v5/common/Pills/UserStakeStatusBadge/index.ts';

import { type StakeItemProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakeItem';

const StakeItem: FC<StakeItemProps> = ({ nativeToken, stake, colony }) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const stakeItemTitle =
    stake.action?.metadata?.customTitle ||
    stake.action?.decisionData?.title ||
    stake.action?.type;

  return (
    <li className="flex flex-col border-b border-gray-100 sm:last:border-none sm:hover:bg-gray-50">
      <button
        type="button"
        className="flex items-center py-3.5 sm:px-6"
        onClick={() =>
          navigate(
            `${window.location.pathname}?${TX_SEARCH_PARAM}=${stake.action?.transactionHash}`,
            {
              replace: true,
            },
          )
        }
      >
        <div className="relative w-full">
          <div className="flex items-center justify-between">
            <div className="mr-2 flex min-w-0 items-center">
              <p className="mr-2 min-w-0 truncate text-1">{stakeItemTitle}</p>
              <span className="mt-0.5 text-xs text-gray-400">
                {format(new Date(stake.createdAt), 'dd MMMM yyyy')}
              </span>
            </div>
          </div>
          <div className="flex text-xs">
            <div className="mr-2 font-medium text-gray-500">
              <Numeral
                value={stake.amount}
                decimals={nativeToken.decimals}
                suffix={` ${nativeToken.symbol}`}
              />
            </div>
            <div className="text-gray-500">
              {stake.action
                ? formatMessage(
                    { id: 'action.title' },
                    getActionTitleValues(stake.action, colony),
                  )
                : '-'}
            </div>
          </div>
        </div>
        <UserStakeStatusBadge status={stake.status} />
      </button>
    </li>
  );
};

StakeItem.displayName = displayName;

export default StakeItem;
