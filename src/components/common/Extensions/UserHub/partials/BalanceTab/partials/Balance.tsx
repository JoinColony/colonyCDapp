import {
  ArrowCircleDownRight,
  ArrowCircleUpRight,
  Eye,
} from '@phosphor-icons/react';
import React, { type FC, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { UserHubTab } from '~common/Extensions/UserHub/types.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useTokensModalContext } from '~context/TokensModalContext/TokensModalContext.ts';
import { useGetUserTokenBalanceQuery } from '~gql';
import { useMobile } from '~hooks/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { TokensModalType } from '~v5/common/TokensModal/consts.ts';
import Button from '~v5/shared/Button/index.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import reputationTabClasses from '../BalanceTab.styles.ts';
import { type BalanceProps, type ViewStakedButtonProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.Balance';

const MSG = defineMessages({
  nativeToken: {
    id: `${displayName}.nativeToken`,
    defaultMessage: 'Native token balance',
  },
});

const ViewStakedButton: FC<ViewStakedButtonProps> = ({
  isFullSize,
  onClick,
}) => (
  <Button
    mode="primaryOutline"
    size="extraSmall"
    icon={Eye}
    iconSize={12}
    isFullSize={isFullSize}
    text={formatText({ id: 'button.viewStaked' })}
    onClick={onClick}
  />
);

const Balance: FC<BalanceProps> = ({ nativeToken, wallet, onTabChange }) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const { data: tokenBalanceQueryData } = useGetUserTokenBalanceQuery({
    variables: {
      input: {
        walletAddress: wallet?.address ?? '',
        tokenAddress: nativeToken?.tokenAddress ?? '',
        colonyAddress,
      },
    },
    skip: !wallet?.address || !nativeToken?.tokenAddress,
  });
  const tokenBalanceData = tokenBalanceQueryData?.getUserTokenBalance;

  const tokenDecimals = useMemo(
    () => getTokenDecimalsWithFallback(nativeToken?.decimals),
    [nativeToken],
  );

  const { toggleOnTokensModal, setTokensModalType } = useTokensModalContext();

  return (
    <div>
      <TitleLabel text={formatMessage(MSG.nativeToken)} />
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 pt-2">
        <div className={reputationTabClasses.row}>
          <span className={reputationTabClasses.rowName}>
            {formatMessage({ id: 'total.balance' })}
          </span>
          <Numeral
            className={reputationTabClasses.numeral}
            value={tokenBalanceData?.balance ?? 0}
            decimals={tokenDecimals}
            suffix={` ${multiLineTextEllipsis(nativeToken?.symbol ?? 'CLNY', 5)}`}
            appearance={{ size: 'small' }}
          />
        </div>
        {/* @TODO: actived icons? */}
        <div>
          <div className={reputationTabClasses.row}>
            <div className="flex items-center gap-4">
              <span className={reputationTabClasses.rowName}>
                {formatMessage({ id: 'active' })}
              </span>
              {!isMobile && (
                <div className="flex gap-2">
                  <Button
                    mode="primaryOutline"
                    size="extraSmall"
                    icon={ArrowCircleDownRight}
                    iconSize={12}
                    text={formatText({ id: 'button.activate' })}
                    onClick={() => {
                      toggleOnTokensModal();
                      setTokensModalType(TokensModalType.Activate);
                    }}
                  />
                  <Button
                    mode="primaryOutline"
                    size="extraSmall"
                    icon={ArrowCircleUpRight}
                    iconSize={12}
                    text={formatText({ id: 'button.deactivate' })}
                    onClick={() => {
                      toggleOnTokensModal();
                      setTokensModalType(TokensModalType.Deactivate);
                    }}
                  />
                </div>
              )}
            </div>
            <Numeral
              className={reputationTabClasses.numeral}
              value={tokenBalanceData?.activeBalance ?? 0}
              decimals={tokenDecimals}
              suffix={` ${multiLineTextEllipsis(nativeToken?.symbol ?? 'CLNY', 5)}`}
              appearance={{ size: 'small' }}
            />
          </div>
          {isMobile && (
            <div className="mt-3 flex w-full gap-2">
              <Button
                mode="primaryOutline"
                size="extraSmall"
                icon={ArrowCircleDownRight}
                iconSize={12}
                text={formatText({ id: 'button.activate' })}
                isFullSize
                onClick={() => {
                  toggleOnTokensModal();
                  setTokensModalType(TokensModalType.Activate);
                }}
              />
              <Button
                mode="primaryOutline"
                size="extraSmall"
                icon={ArrowCircleUpRight}
                iconSize={12}
                text={formatText({ id: 'button.deactivate' })}
                isFullSize
                onClick={() => {
                  toggleOnTokensModal();
                  setTokensModalType(TokensModalType.Deactivate);
                }}
              />
            </div>
          )}
        </div>

        {/* @TODO: stacked icon viewed? */}
        <div>
          <div className={reputationTabClasses.row}>
            <div className="flex items-center gap-4">
              <span className={reputationTabClasses.rowName}>
                {formatMessage({ id: 'staked' })}
              </span>
              {!isMobile && (
                <ViewStakedButton
                  onClick={() => onTabChange(UserHubTab.Stakes)}
                />
              )}
            </div>
            <Numeral
              className={reputationTabClasses.numeral}
              value={tokenBalanceData?.lockedBalance ?? 0}
              decimals={tokenDecimals}
              suffix={` ${multiLineTextEllipsis(nativeToken?.symbol ?? 'CLNY', 5)}`}
              appearance={{ size: 'small' }}
            />
          </div>
          {isMobile && (
            <div className="mt-3">
              <ViewStakedButton
                onClick={() => onTabChange(UserHubTab.Stakes)}
                isFullSize
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Balance.displayName = displayName;

export default Balance;
