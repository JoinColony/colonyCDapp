import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { BigNumber } from 'ethers';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo, type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import TokenIcon from '~shared/TokenIcon/index.ts';

import {
  type PaymentBuilderPayoutItem,
  type PaymentBuilderPayoutsTotalProps,
} from './types.ts';

const PaymentBuilderTokensTotal: FC<PaymentBuilderPayoutsTotalProps> = ({
  payouts,
}) => {
  const [isExpanded, { toggle }] = useToggle();
  const sortedPayouts =
    useMemo(
      () =>
        payouts?.sort((a, b) => {
          if (
            !a.amount ||
            !b.amount ||
            BigNumber.from(a.amount || '0').eq(BigNumber.from(b.amount || '0'))
          )
            return 0;

          return BigNumber.from(a.amount || '0').gt(
            BigNumber.from(b.amount || '0'),
          )
            ? -1
            : 1;
        }),
      [payouts],
    ) || [];

  const getItem = (token: PaymentBuilderPayoutItem) => (
    <div className="flex items-center gap-3 text-gray-900 text-1">
      <Numeral value={token.amount} decimals={token.decimals} />
      <div className="flex items-center gap-1">
        <TokenIcon
          token={token}
          size="xxs"
          className="flex-shrink-0 text-gray-900"
        />
        <span>{token.symbol}</span>
      </div>
    </div>
  );

  if (!sortedPayouts.length) {
    return null;
  }

  return (
    <div className="w-full">
      {sortedPayouts.length > 1 ? (
        <>
          <button
            type="button"
            className="flex w-full items-center gap-2 py-[.3125rem]"
            onClick={toggle}
          >
            {getItem(sortedPayouts[0])}
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
                  {sortedPayouts.slice(1).map((token) => (
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
        <div className="w-full py-[.3125rem]">{getItem(sortedPayouts[0])}</div>
      )}
    </div>
  );
};

export default PaymentBuilderTokensTotal;
