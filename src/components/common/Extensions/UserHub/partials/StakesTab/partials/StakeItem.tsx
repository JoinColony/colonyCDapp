import React, { type FC } from 'react';
import { FormattedDate, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { getActionTitleValues } from '~common/ColonyActions/index.ts';
import { TX_SEARCH_PARAM } from '~routes';
import Numeral from '~shared/Numeral/index.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import UserStakeStatusBadge from '~v5/common/Pills/UserStakeStatusBadge/index.ts';

import { type StakeItemProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakeItem';

const StakeItem: FC<StakeItemProps> = ({ nativeToken, stake, colony }) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { expenditure } = useGetExpenditureData(stake.action?.expenditureId);

  const stakeItemTitle =
    stake.action?.metadata?.customTitle ||
    stake.action?.decisionData?.title ||
    expenditure?.actions?.items?.[0]?.metadata?.customTitle ||
    stake.action?.type;

  const stakeItemTransctionHash = expenditure
    ? expenditure?.actions?.items?.[0]?.transactionHash
    : stake.action?.transactionHash;

  return (
    <li className="flex flex-col border-b border-gray-100 py-3.5 first:pt-2 last:pb-6 sm:first:pt-0 sm:last:border-none sm:last:pb-1.5">
      <button
        type="button"
        onClick={() =>
          navigate(
            `${window.location.pathname}?${TX_SEARCH_PARAM}=${stakeItemTransctionHash}`,
            {
              replace: true,
            },
          )
        }
      >
        <div className="relative w-full py-3.5 sm:px-6 sm:hover:bg-gray-50">
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
                    getActionTitleValues({
                      actionData: stake.action,
                      colony,
                      expenditureData: expenditure ?? undefined,
                    }),
                  )
                : '-'}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
};

StakeItem.displayName = displayName;

export default StakeItem;
