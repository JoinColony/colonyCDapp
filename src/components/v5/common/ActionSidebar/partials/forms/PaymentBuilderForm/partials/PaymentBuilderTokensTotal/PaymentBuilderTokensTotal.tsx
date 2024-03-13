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
  type PaymentBuilderTokenItem,
  type PaymentBuilderTokensTotalProps,
} from './types.ts';

const PaymentBuilderTokensTotal: FC<PaymentBuilderTokensTotalProps> = ({
  tokens,
}) => {
  const [isExpanded, { toggle }] = useToggle();
  const sortedTokens =
    useMemo(
      () =>
        tokens?.sort((a, b) => {
          if (
            !a.amount ||
            !b.amount ||
            BigNumber.from(a.amount).eq(BigNumber.from(b.amount))
          )
            return 0;

          return BigNumber.from(a.amount).gt(BigNumber.from(b.amount)) ? -1 : 1;
        }),
      [tokens],
    ) || [];

  const getItem = (token: PaymentBuilderTokenItem) => (
    <div className="flex items-center gap-3 text-1 text-gray-900">
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

  return (
    <div className="w-full">
      {sortedTokens.length > 1 ? (
        <>
          <button
            type="button"
            className="w-full py-[.3125rem] flex items-center gap-2"
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
