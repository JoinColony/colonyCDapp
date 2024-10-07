import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import { AnimatePresence, motion } from 'framer-motion';
import moveDecimal from 'move-decimal-point';
import React, { useMemo, type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { type ExpenditurePayout } from '~types/graphql.ts';
import { sortPayouts } from '~utils/sortPayouts.ts';
import { getSelectedToken } from '~utils/tokens.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { type PaymentBuilderPayoutsTotalProps } from './types.ts';

const PaymentBuilderTokensTotal: FC<PaymentBuilderPayoutsTotalProps> = ({
  data,
  convertToWEI,
  itemClassName,
  buttonClassName,
}) => {
  const { colony } = useColonyContext();
  const [isExpanded, { toggle }] = useToggle();

  const sortedTokens =
    useMemo(() => {
      const summedTokens = data.reduce<ExpenditurePayout[]>((result, item) => {
        if (!item) {
          return result;
        }

        const { amount = '0', tokenAddress } = item;

        if (!tokenAddress) {
          return result;
        }

        const tokenData = getSelectedToken(colony, tokenAddress);

        if (!tokenData) {
          return result;
        }

        const existingEntryIndex = result.findIndex(
          (entry) => entry.tokenAddress === tokenAddress,
        );

        const tokenAmount = convertToWEI
          ? moveDecimal(amount, tokenData.decimals)
          : amount;

        if (existingEntryIndex < 0) {
          return [
            ...result,
            {
              tokenAddress,
              isClaimed: false,
              amount: tokenAmount,
            },
          ];
        }

        return [
          ...result.slice(0, existingEntryIndex),
          {
            ...result[existingEntryIndex],
            amount: BigNumber.from(result[existingEntryIndex].amount)
              .add(BigNumber.from(tokenAmount || '0'))
              .toString(),
          },
          ...result.slice(existingEntryIndex + 1),
        ];
      }, []);

      return sortPayouts(summedTokens);
    }, [colony, data, convertToWEI]) || [];

  const getItem = (payout: ExpenditurePayout) => {
    const tokenData = getSelectedToken(colony, payout.tokenAddress);

    return tokenData ? (
      <div
        className={clsx(
          itemClassName,
          'flex items-center gap-3 text-gray-900 text-1',
        )}
      >
        <Numeral value={payout.amount} decimals={tokenData?.decimals} />
        <div className="flex items-center gap-1">
          <TokenAvatar
            tokenAddress={tokenData.tokenAddress}
            tokenAvatarSrc={tokenData.avatar ?? undefined}
            tokenName={tokenData.name}
            size={18}
            className="flex-shrink-0 text-gray-900"
          />
          <span>{tokenData?.symbol}</span>
        </div>
      </div>
    ) : null;
  };

  if (!sortedTokens.length) {
    return null;
  }

  return (
    <div className="w-full">
      {sortedTokens.length > 1 ? (
        <>
          <button
            type="button"
            className={clsx(
              buttonClassName,
              'flex w-full items-center gap-2 py-[.3125rem]',
            )}
            onClick={toggle}
          >
            {getItem(sortedTokens[0])}
            <CaretDown
              size={12}
              className={clsx('flex-shrink-0 transition', {
                'rotate-180': isExpanded,
              })}
            />
          </button>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                variants={accordionAnimation}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="overflow-hidden"
              >
                <ul>
                  {sortedTokens.slice(1).map((token) => (
                    <li
                      key={token.tokenAddress}
                      className="w-full py-[.3125rem]"
                    >
                      {getItem(token)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="w-full py-[.3125rem]">{getItem(sortedTokens[0])}</div>
      )}
    </div>
  );
};

export default PaymentBuilderTokensTotal;
