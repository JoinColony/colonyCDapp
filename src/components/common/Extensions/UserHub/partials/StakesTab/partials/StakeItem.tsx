import React, { useMemo, type FC, useState } from 'react';
import { useEffect } from 'react';
import { FormattedDate, useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetActionTitleValues } from '~common/ColonyActions/index.ts';
import { UserStakeType } from '~gql';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { TX_SEARCH_PARAM } from '~routes';
import Numeral from '~shared/Numeral/index.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import UserStakeStatusBadge from '~v5/common/Pills/UserStakeStatusBadge/index.ts';

import { type StakeItemProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.StakesTab.partials.StakeItem';

const StakeItem: FC<StakeItemProps> = ({ stake }) => {
  const [stakeTxParam, setStakeTxParam] = useState(
    stake.action?.transactionHash,
  );
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { expenditure } = useGetExpenditureData(stake.action?.expenditureId);
  const { networkInverseFee } = useNetworkInverseFee();

  const stakeItemTitle =
    stake.action?.metadata?.customTitle ||
    stake.action?.decisionData?.title ||
    expenditure?.creatingActions?.items?.[0]?.metadata?.customTitle ||
    stake.action?.type;

  const { colonyName: colonyNameUrl } = useParams();

  const stakeColonyName = stake.action?.colony.name ?? '';

  const partialStakeColony = useMemo(() => {
    if (!stake.action?.colony) {
      return null;
    }

    const { nativeToken, metadata } = stake.action.colony;

    return {
      nativeToken: {
        decimals: nativeToken.nativeTokenDecimals,
        symbol: nativeToken.nativeTokenSymbol,
        tokenAddress: nativeToken.tokenAddress,
        name: nativeToken.name,
      },
      metadata,
    };
  }, [stake.action]);

  const navigatePath = useMemo(() => {
    return colonyNameUrl !== stakeColonyName
      ? `/${stakeColonyName}`
      : window.location.pathname;
  }, [colonyNameUrl, stakeColonyName]);

  const titleValues = useGetActionTitleValues({
    actionData: stake.action,
    colony: partialStakeColony || undefined,
    expenditureData: expenditure ?? undefined,
    networkInverseFee,
  });

  useEffect(() => {
    if (stake.type === UserStakeType.Motion) {
      setStakeTxParam(
        stake.action?.expenditure?.creatingActions?.items[0]?.transactionHash,
      );
    }
  }, [
    stake.type,
    setStakeTxParam,
    stake.action?.expenditure?.creatingActions?.items,
  ]);

  return (
    <li className="flex flex-col border-b border-gray-100 first:pt-2 last:pb-6 sm:first:pt-0 sm:last:border-none sm:last:pb-1.5">
      <button
        type="button"
        onClick={() =>
          navigate(
            setQueryParamOnUrl({
              path: navigatePath,
              params: {
                [TX_SEARCH_PARAM]: stakeTxParam,
              },
            }),
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
              {partialStakeColony && (
                <Numeral
                  value={stake.amount}
                  decimals={partialStakeColony.nativeToken.decimals}
                  suffix={` ${partialStakeColony.nativeToken.symbol}`}
                />
              )}
            </div>
            <div className="text-gray-600">
              {stake.action && partialStakeColony
                ? formatMessage({ id: 'action.title' }, titleValues)
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
