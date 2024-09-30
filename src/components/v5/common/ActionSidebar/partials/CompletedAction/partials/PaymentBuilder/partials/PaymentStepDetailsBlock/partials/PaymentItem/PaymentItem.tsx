import { CaretDown } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC, useMemo } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { type ExpenditurePayout } from '~types/graphql.ts';
import { sortPayouts } from '~utils/sortPayouts.ts';
import { getSelectedToken } from '~utils/tokens.ts';

import { type PaymentItemProps } from './types.ts';

const PaymentItem: FC<PaymentItemProps> = ({ payouts }) => {
  const { colony } = useColonyContext();
  const [isExpanded, { toggle }] = useToggle();
  const sortedPayouts = useMemo(() => sortPayouts(payouts), [payouts]) || [];

  if (!sortedPayouts.length) {
    return null;
  }

  const getItem = (token: ExpenditurePayout) => {
    const tokenData = getSelectedToken(colony, token.tokenAddress);

    return tokenData ? (
      <Numeral
        value={token.amount}
        decimals={tokenData?.decimals}
        suffix={` ${tokenData?.symbol}`}
      />
    ) : null;
  };

  return (
    <div className="w-full py-[.125rem]">
      {sortedPayouts.length > 1 ? (
        <>
          <button
            type="button"
            className="flex w-full items-center justify-end gap-2 py-[.125rem]"
            onClick={toggle}
          >
            {getItem(sortedPayouts[0])}
            <CaretDown
              size={16}
              className={clsx('flex-shrink-0 text-gray-500 transition', {
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
                <ul className="pr-6">
                  {sortedPayouts.slice(1).map((token) => (
                    <li
                      key={token.tokenAddress}
                      className="w-full py-[.125rem]"
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
        <div className="w-full py-[.125rem]">{getItem(sortedPayouts[0])}</div>
      )}
    </div>
  );
};

export default PaymentItem;
